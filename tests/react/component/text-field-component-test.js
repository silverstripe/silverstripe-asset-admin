jest.dontMock('../../../javascript/src/components/text-field/index.js');


describe('TextFieldComponent', function() {

    var React = require('react'),
        ReactTestUtils = require('react-addons-test-utils'),
        TextFieldComponent = require('../../../javascript/src/components/text-field/index.js'),
        props;

    beforeEach(function () {
        props = {
            label: '',
            name: '',
            value: '',
            onChange: jest.genMockFunction()
        };
    });

    describe('handleChange()', function () {
        var textField;

        beforeEach(function () {
            textField = ReactTestUtils.renderIntoDocument(
                <TextFieldComponent {...props} />
            );
        });

        it('should call the onChange function on props', function () {
            textField.handleChange();

            expect(textField.props.onChange.mock.calls.length).toBe(1);
        });
    });
});
