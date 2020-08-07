<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;


use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\GraphQL\FileFilter;
use SilverStripe\AssetAdmin\GraphQL\FileFilterInputTypeCreator;
use SilverStripe\AssetAdmin\GraphQL\Notice;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\GraphQL\QueryHandler\QueryHandler;
use SilverStripe\GraphQL\Schema\DataObject\FieldAccessor;
use SilverStripe\GraphQL\Schema\Resolver\DefaultResolverProvider;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\Filterable;
use SilverStripe\Versioned\Versioned;
use InvalidArgumentException;

class AssetAdminResolver extends DefaultResolverProvider
{
    public static function resolveFileInterfaceType($object)
    {
        if ($object instanceof Folder) {
            return 'Folder';
        }
        if ($object instanceof File) {
            return 'File';
        }

    }

    public static function resolveCreateFile($object, array $args, $context, ResolveInfo $info)
    {
        $accessor = FieldAccessor::singleton();
        $parentID = isset($args['file']['parentId']) ? intval($args['file']['parentId']) : 0;
        if ($parentID) {
            $parent = Versioned::get_by_stage(Folder::class, Versioned::DRAFT)->byID($parentID);
            if (!$parent) {
                throw new InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $parentID
                ));
            }
        }

        $canCreateContext = [];
        foreach ($args['file'] as $name => $val) {
            $canCreateContext[$accessor->normaliseField(File::singleton(), $name)] = $val;
        }
        if (!File::singleton()->canCreate($context[QueryHandler::CURRENT_USER], $canCreateContext)) {
            throw new InvalidArgumentException(sprintf(
                '%s# create not allowed',
                File::class
            ));
        }

        $file = File::create();
        foreach ($args['file'] as $name => $val) {
            $field = $accessor->normaliseField($file, $name);
            $file->$field = $val;
        }

        $file->writeToStage(Versioned::DRAFT);

        return $file;
    }

    public function resolveCreateFolder($object, array $args, $context, ResolveInfo $info)
    {
        $accessor = FieldAccessor::singleton();
        $parentID = isset($args['folder']['parentId']) ? intval($args['folder']['parentId']) : 0;
        if ($parentID) {
            $parent = Versioned::get_by_stage(Folder::class, Versioned::DRAFT)->byID($parentID);
            if (!$parent) {
                throw new InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $parentID
                ));
            }
        }

        // Check permission
        $canCreateContext = [];
        foreach ($args['folder'] as $name => $val) {
            $canCreateContext[$accessor->normaliseField(Folder::singleton(), $name)] = $val;
        }
        if (!Folder::singleton()->canCreate($context['currentUser'] ?? null, $canCreateContext)) {
            throw new InvalidArgumentException(sprintf(
                '%s create not allowed',
                Folder::class
            ));
        }

        $folder = Folder::create();
        foreach ($args['folder'] as $name => $val) {
            $field = $accessor->normaliseField($folder, $name);
            $folder->$field = $val;
        }

        $folder->writeToStage(Versioned::DRAFT);

        return $folder;
    }

    public function resolveDeleteFiles($object, array $args, $context, ResolveInfo $info)
    {
        if (!isset($args['IDs']) || !is_array($args['IDs'])) {
            throw new InvalidArgumentException('IDs must be an array');
        }
        $idList = $args['IDs'];

        /** @var DataList $file */
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)->byIDs($idList);
        if ($files->count() < count($idList)) {
            // Find out which files count not be found
            $missingIds = array_diff($idList, $files->column('ID'));
            throw new InvalidArgumentException(sprintf(
                '%s items %s are not found',
                File::class,
                implode(', ', $missingIds)
            ));
        }

        $deletedIDs = [];
        foreach ($files as $file) {
            if ($file->canArchive($context[QueryHandler::CURRENT_USER])) {
                $file->doArchive();
                $deletedIDs[] = $file->ID;
            }
        }

        return $deletedIDs;
    }

    public static function resolveMoveFiles($object, array $args, $context)
    {
        $folderId = (isset($args['folderId'])) ? $args['folderId'] : 0;

        if ($folderId) {
            /** @var Folder $folder */
            $folder = Versioned::get_by_stage(Folder::class, Versioned::DRAFT)
                ->byID($folderId);
            if (!$folder) {
                throw new InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $folderId
                ));
            }

            // Check permission
            if (!$folder->canEdit($context[QueryHandler::CURRENT_USER])) {
                throw new InvalidArgumentException(sprintf(
                    '%s edit not allowed',
                    Folder::class
                ));
            }
        }
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)
            ->byIDs($args['fileIds']);
        $errorFiles = [];

        /** @var File $file */
        foreach ($files as $file) {
            if ($file->canEdit($context[QueryHandler::CURRENT_USER])) {
                $file->ParentID = $folderId;
                $file->writeToStage(Versioned::DRAFT);
            } else {
                $errorFiles[] = $file->ID;
            }
        }

        if ($errorFiles) {
            throw new InvalidArgumentException(sprintf(
                '%s (%s) edit not allowed',
                File::class,
                implode(', ', $errorFiles)
            ));
        }

        if (!isset($folder)) {
            return Folder::singleton();
        }
        return $folder;
    }


    public static function resolvePublicationNotice($value, array $args, array $context, ResolveInfo $info)
    {
        $fieldName = $info->fieldName;
        $method = 'get'.$fieldName;
        if (method_exists($value, $method)) {
            return $value->$method();
        }

        throw new \Exception(sprintf(
            'Invalid field %s on %s',
            $fieldName,
            get_class($value)
        ));
    }

    /**
     * @param $value
     * @return string
     */
    public static function resolvePublicationResultUnion($value): string
    {
        if ($value instanceof File) {
            return 'File';
        }
        if ($value instanceof Notice) {
            return 'PublicationNotice';
        }
    }


    public function resolveReadFileUsage($object, array $args, $context, ResolveInfo $info): array
    {
        if (!isset($args['IDs']) || !is_array($args['IDs'])) {
            throw new InvalidArgumentException('IDs must be an array');
        }
        $idList = $args['IDs'];

        /** @var DataList|File[] $files */
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)->byIDs($idList);
        if ($files->count() < count($idList)) {
            // Find out which files count not be found
            $missingIds = array_diff($idList, $files->column('ID'));
            throw new InvalidArgumentException(sprintf(
                '%s items %s are not found',
                File::class,
                implode(', ', $missingIds)
            ));
        }

        $usage = [];
        foreach ($files as $file) {
            if ($file->canView($context[QueryHandler::CURRENT_USER])) {
                $useEntry = ['id' => $file->ID];
                $useEntry['inUseCount'] = $file instanceof Folder ?
                    $file->getFilesInUse()->count():
                    $file->BackLinkTrackingCount();
                $usage[] = $useEntry;
            }
        }

        return $usage;
    }

    /**
     * @param $object
     * @param array $args
     * @param $context
     * @param $info
     * @return DataList|Filterable
     * @throws HTTPResponse_Exception
     */
    public static function resolveReadFiles($object, array $args, $context, $info)
    {
        $filter = (!empty($args['filter'])) ? $args['filter'] : [];

        // Permission checks
        $parent = Folder::singleton();
        if (isset($filter['parentId']) && $filter['parentId'] !== 0) {
            $parent = Folder::get()->byID($filter['parentId']);
            if (!$parent) {
                throw new InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $filter['parentId']
                ));
            }
        }
        if (!$parent->canView($context[QueryHandler::CURRENT_USER])) {
            throw new InvalidArgumentException(sprintf(
                '%s#%s view access not permitted',
                Folder::class,
                $parent->ID
            ));
        }

        if (isset($filter['recursive']) && $filter['recursive']) {
            throw new InvalidArgumentException((
            'The "recursive" flag can only be used for the "children" field'
            ));
        }

        // Filter list
        $list = Versioned::get_by_stage(File::class, Versioned::DRAFT);
        $list = FileFilter::filterList($list, $filter);

        // Permission checks
        $list = $list->filterByCallback(function (File $file) use ($context) {
            return $file->canView($context[QueryHandler::CURRENT_USER]);
        });

        return $list;
    }

}
