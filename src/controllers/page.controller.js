export class PageController {
  mainPage(req, res) {
    res.render("index");
  }

  /**
   * Login page
   *
   * Method = GET
   * URL = /login
   */
  loginPage(req, res) {
    res.render("pages/login");
  }

  /**
   * Register page
   *
   * Method = GET
   * URL = /register
   */
  registerPage(req, res) {
    res.render("pages/register");
  }

  /**
   * Home page
   *
   * Method = GET
   * URL = /home
   */
  homePage(req, res) {
    res.render("pages/todo");
  }

  /**
   * Profile page
   *
   * Method = GET
   * URL = /profile
   */
  profilePage(req, res) {
    res.render("pages/profile");
  }

  /**
   * Users page - barcha foydalanuvchilarni kio'rsatuvchi sahifa
   *
   * Method = GET
   * URL = /profile
   */
  usersPage(req, res) {
    res.render("pages/users");
  }

  /**
   * User todos page - boshqa foydalanuvchi todo'larini ko'rsatuvchi sahifa
   *
   * Method ---> GET
   * URL    ---> /
   */
  userTodosPage(req, res) {
    res.render("pages/user-todos");
  }
}
