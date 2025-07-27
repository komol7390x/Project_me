import AdminValidate from '../../validators/users/admin.validate.js';
import { validate } from '../../validators/base.validate.js'
import { AuthGuard } from '../../guards/auth.guard.js'
import { RoleGuard } from '../../guards/role.guard.js'
import config from '../../config/server.config.js'

class AdminMiddleware {
    post = (req, res, next) => {
        AuthGuard(req, res, (err) => {
            if (err) return next(err);
            RoleGuard(config.SUPERADMIN.role)(req, res, (err) => {
                if (err) return next(err);
                validate(AdminValidate.create)(req, res, (err) => {
                    if (err) return next(err);
                    next();
                });
            });
        });
    }

}


export default new AdminMiddleware()