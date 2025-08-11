import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import multer from 'multer'
import { v4 } from 'uuid'

const uploadDir = join(process.cwd(), 'uploads')
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const importFile = file.mimetype.split('/')[0]
        const path = join(uploadDir, importFile)
        if (!existsSync(path)) {
            mkdirSync(path, { recursive: true })
        }
        cb(null, path)
    },

    filename: function (_req, file, cb) {
        const fileName = `${v4()}_${file.originalname}`;
        cb(null, fileName)
    }
})
const uploadFile = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const files = file.mimetype.split('/')[0]
        if (files!='images') {
            cb(null, true)
        } else {
            cb(new Error('Faqat rasm, video va hujjat yuklash mumkin!'), false)
        }
    },
    limits: { fileSize: 5 * 1024 * 1024, files: 5 }
})
export const oneFile=uploadFile.single('image')
export const moreFile = uploadFile.array('images', 5)