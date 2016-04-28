function jQuery() {
  return {
    change: () => this,
    chosen: () => this,
    find: () => this,
    val: () => this,
    trigger: () => this,
  };
}

jQuery.ajax = () => ({ done: () => {} });

export default jQuery;
