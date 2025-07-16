export class PageController {
  /**
   * index.ejs faylini render qiluvchi method
   *
   * Methd ---> GET
   * URL   ---> /
   * @param {*} req
   * @param {*} res
   */
  mainPage(req, res) {
    res.render("index");
  }

  /**
   * Login sahifani render qiluvchi method
   *
   * Method ---> GET
   * URL    ---> /login
   * @param {*} req
   * @param {*} res
   */
  loginPage(req, res) {
    res.render("pages/login");
  }

  /**
   * Register sahifani render qiluvchi method
   *
   * Method ---> GET
   * URL    ---> /register
   * @param {*} req
   * @param {*} res
   */
  registerPage(req, res) {
    res.render("pages/register");
  }

  /**
   * Todo sahifani render qiluvchi method
   *
   * Method ---> GET
   * URL    ---> /home
   * @param {*} req
   * @param {*} res
   */
  homePage(req, res) {
    res.render("pages/todo");
  }
}
