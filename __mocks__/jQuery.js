function jQuery() {
    return {
        change: function () {
            return this;
        },
        chosen: function () {
            return this;
        },
        find: function () {
            return this;
        },
        val: function () {
            return this;
        },
        trigger: function() {
            return this;
        }
    };
}

jQuery.ajax = function () {
    return {
        done: function () { }
    };
};

export default jQuery;
