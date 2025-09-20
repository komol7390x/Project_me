export class SwaggerDate {
  // ----------------------------------- BOOK -----------------------------------
  static adminDate = {
    id: 3,
    createdAt: '2025-09-18T15:15:36.302Z',
    updatedAt: '2025-09-18T15:15:36.302Z',
    full_name: 'Admin User',
    username: 'admin124',
    hashed_password:
      '$2b$07$Umg.7aiQ36R0cHgdwYzPeO1GiY0KYVTFFeWofbYLsbd5GDj9mboua',
    role: 'ADMIN',
    is_active: true,
  };

  static adminAll = {
    id: 3,
    createdAt: '2025-09-18T15:15:36.302Z',
    full_name: 'Admin User',
    username: 'admin124',
    role: 'ADMIN',
  };
  static tokenRes = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaXNfYWN0aXZlIjp0cnVlLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTc1MjgxMzksImV4cCI6MTc1NzYxNDUzOX0.lP1z1R3Y1ZJ0aF3Do5y45jIWZLqmbJXnY0IS1-1Pzqc`;

  // ----------------------------------- USER -----------------------------------

  static userDate = {
    id: 5,
    full_name: 'User User',
    email: 'www.exapmle@gmail.com',
    role: 'LIBRARY',
    is_active: true,
  };

  static userAll = {
    id: 5,
    full_name: 'User User',
    email: 'www.exapmle@gmail.com',
    role: 'LIBRARY',
    is_active: true,
  };
  // ----------------------------------- BOOK -----------------------------------

  static bookDate = {
    id: 1,
    createdAt: '2025-09-18T07:33:24.698Z',
    title: 'Lord Rings',
    author: 'J.R.Tolkin',
    published_year: '2008-08-02',
    avialable: true,
  };

  static bookAll = {
    id: 3,
    createdAt: '2025-09-18T15:55:58.542Z',
    title: 'Lord Rings 3',
    author: 'J.R.Tolkin',
    published_year: '2008-08-02',
    avialable: true,
    borrow: [],
    history: [],
  };
  // ----------------------------------- BORROW -----------------------------------

  static borrowDate = {
    borrow_date: '2025-09-16',
    due_date: '2025-09-23',
    return_date: '2025-09-20',
    overdue: false,
  };

  static borrowAll = {
    borrow_date: '2025-09-18',
    due_date: '2025-09-26',
    overdue: false,
    books: {
      id: 2,
      title: 'Lord Rings 2',
    },
    user: {
      id: 1,
      full_name: 'User User',
      email: 'www.komol7390@gmail.com',
    },
  };

  // -------------------------------- BOOK --------------------------------
  static BookhistoryDate = {
    id: 1,
    action: 'RETURN',
    date: '2025-09-18',
    user: {
      id: 1,
      email: 'www.komol7390@gmail.com',
    },
    books: {
      id: 1,
      title: 'Lord Rings',
      avialable: false,
    },
  };
}
