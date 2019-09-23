import Injector from 'lib/Injector';
import { fileInterface, file } from 'lib/fileFragments';
import readFilesQuery from 'state/files/readFilesQuery';
import readFileUsageQuery from 'state/files/readFileUsageQuery';

const registerQueries = () => {
  Injector.query.registerFragment('FileInterfaceFields', fileInterface);
  Injector.query.registerFragment('FileFields', file);
  Injector.query.register('ReadFilesQuery', readFilesQuery);
  Injector.query.register('readFileUsageQuery', readFileUsageQuery);
};
export default registerQueries;
