import AdminValidate from '../../validators/users/admin.validate.js';
import { validate } from '../../validators/base.validate.js'
import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import config from '../../config/server.config.js'
class AdminMiddleware {
    post = () => {
        AuthGuard, RoleGuard(config.SUPERADMIN.role), validate(AdminValidate.create);

    }
}

export default new AdminMiddleware()