import { Image } from '../../models/index.schema.js'
import { BaseController } from './base.controller.js';

class ImageController extends BaseController {
    constructor() {
        super(Image)
    }
}

export default new ImageController();