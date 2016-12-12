function jQuery() {
  return {
    change() {
      return this;
    },
    chosen() {
      return this;
    },
    find() {
      return this;
    },
    val() {
      return this;
    },
    trigger() {
      return this;
    },
    on() {
      return this;
    },
    off() {
      return this;
    },
  };
}

jQuery.ajax = () => ({ done: () => {} });

export default jQuery;
