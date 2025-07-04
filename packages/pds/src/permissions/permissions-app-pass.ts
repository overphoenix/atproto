import { PRIVILEGED_METHODS } from '../pipethrough.js'
import { PermissionSet, RpcOptions } from './permission-set.js'

export class PermissionsAppPass extends PermissionSet {
  allowsAccount() {
    return true
  }

  allowsIdentity() {
    return false
  }

  allowsRpc({ lxm }: RpcOptions) {
    if (lxm && PRIVILEGED_METHODS.has(lxm)) {
      return false
    }

    return true
  }
}
