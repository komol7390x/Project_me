import { IResponse } from "src/interface/success-interface";

export const successRes = (data: object, statusCode: number = 200): IResponse => {
    return {
        statusCode,
        message: 'success',
        data
    }
}