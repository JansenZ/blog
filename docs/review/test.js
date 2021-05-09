function iOf (child, parent) {
    while(child) {
        if(child == parent.prototype) return true;
        child = child.__proto__;
    }
    return false;
}