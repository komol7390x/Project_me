import { isValidObjectId } from "mongoose";

class BaseController {
  constructor(todoModel) {
    this.todoModel = todoModel;
  }

  /**
   * Foydalanuvchi tasklarini yaratadi
   * 
   * Metho ---> POST
   * url   ---> /api/todos
   * @param {*} req 
   * @param {*} res 
   */
  create = async (req, res) => {
    try {
      
      const data = await this.model.create(req.body);
      return res.status(201).json({
        statusCode: 201,
        message: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Taskni barcha foydlanuvchilarni olish
   * 
   * Method ---> GET
   * URL    ---> /api/todos/done/
   */

  findAll = async (_, res) => {
    try {
      const data = await this.model.find();
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }
  /**
* Taskni barcha id foydlanuvchilarni olish
* 
* Method ---> GET
* URL    ---> /api/todos/done/:id
*/
  findById = async (req, res) => {
    try {
      const id = req.params?.id;
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid ObjectId'
        });
      }
      const data = await this.model.findById(id);
      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          message: 'not found'
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
     * Taskni done maydonini true'ga o'zgartiruvchi method 
     * 
     * Method ---> GET
     * URL    ---> /api/todos/done/:id
     */
  update = async (req, res) => {
    try {
      const id = req.params?.id;
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid ObjectId'
        });
      }
      const data = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          message: 'not found by id'
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }

  /**
   * Taskni o'chirib yuborish
   * 
   * Method ---> GET
   * URL    ---> /api/todos/delete/:id
   */
  async deleteTodo(req, res) {
    try {
      const findID = await this.todoModel.findById(id);
      if (!findID) {
        return res.status(404).json({
          message: 'not found user',
          data: {}
        })
      }
      const id = req.params.id
      await this.todoModel.findByIdAndDelete(id, req.body);
      return res.status(200).json({
        message: 'success',
        data: {}
      })
    } catch (error) {
      consola.error(error.message);
      res.status(500).json({
        message: "Xatoli",
      });
    }
  }

  delete = async (req, res) => {
    try {
      const id = req.params?.id;
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          statusCode: 400,
          message: 'Invalid ObjectId'
        });
      }
      const data = await this.model.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          message: 'not found by id'
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: {}
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }

}

export default new BaseController()