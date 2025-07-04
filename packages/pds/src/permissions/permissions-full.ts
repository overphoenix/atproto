import { PermissionSet } from './permission-set.js'

export class PermissionsFull extends PermissionSet {
  allowsAccount() {
    return true
  }

  allowsIdentity() {
    return false
  }

  allowsRpc() {
    return true
  }
}
