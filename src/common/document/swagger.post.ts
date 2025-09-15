export class PostSawgger {
  // ------------------------ GENRE ------------------------
  static genreDate = {
    id: 1,
    createdAt: '2025-09-13T07:02:33.525Z',
    updatedAt: '2025-09-13T07:02:33.525Z',
    name: 'Action',
    movies: [],
  };

  static genreAll = {
    id: 10,
    name: 'Action2',
    movies: [],
  };
  // ------------------------ COUNTRY ------------------------
  static countryDate = {
    id: 1,
    createdAt: '2025-09-13T07:02:33.525Z',
    updatedAt: '2025-09-13T07:02:33.525Z',
    name: 'Uzbekiston',
    movies: [],
  };

  static countryAll = {
    id: 2,
    name: 'Uzbeksiton',
    movies: [],
  };

  // ------------------------ MOVIE ------------------------
  static movieDate = {
    createdAt: '2025-09-13T13:01:23.862Z',
    title: 'Inception',
    description: 'A mind-bending thriller about dreams within dreams.',
    duration: '02:15:20',
    realase_date: '2010-07-16',
    image_url: 'https://example.com/movie-image.jpg',
    video_url: 'https://example.com/movie-video.mp4',
    language: 'Uzb',
    admin: {
      id: 1,
      name: 'Komol',
      username: 'admin123!@',
      role: 'SUPERADMIN',
    },
    genre: {
      id: 9,
      name: 'Action',
    },
    country: {
      id: 1,
      name: 'Uzbeksiton',
    },
  };

  static movieAll = {
    id: 1,
    title: 'Inception',
    description: 'A mind-bending thriller about dreams within dreams.',
    duration: '02:15:20',
    admin: {
      id: 1,
      name: 'John',
      username: 'john123!@',
      role: 'ADMIN',
    },
    genre: {
      id: 9,
      name: 'Action',
    },
    country: {
      id: 1,
      name: 'Uzbeksiton',
    },
  };
  // ------------------------ REVIEW ------------------------

  static reviewDate = {
    id: 1,
    createdAt: '2025-09-13T15:00:57.124Z',
    updatedAt: '2025-09-13T15:00:57.124Z',
    comment: 'Ajoyib film, juda yoqdi!',
    rating: 5,
    customer: {
      id: 1,
      name: 'Alice Johnson',
      email: 'www.komol8689@gmail.com',
    },
    movie: {
      id: 1,
      createdAt: '2025-09-13T14:35:25.417Z',
      title: 'Inception 2',
    },
  };

  static reviewAll = {
    id: 1,
    comment: 'Ajoyib film, juda yoqdi!',
    rating: 5,
    customer: {
      id: 1,
      name: 'Alice Johnson',
      email: 'www.komol8689@gmail.com',
    },
    movie: {
      id: 1,
      createdAt: '2025-09-13T14:35:25.417Z',
      title: 'Inception 2',
    },
  };

  // --------------------------- ROOM ---------------------------

  static roomDate = {
    id: 2,
    createdAt: '2025-09-13T16:05:35.815Z',
    updatedAt: '2025-09-13T16:05:35.815Z',
    name: 'VIP Hall 2',
    location: '1st Floor, Building A',
    total_seats: 120,
    is_active: true,
  };

  static roomAll = {
    id: 1,
    name: 'VIP Hall 2',
    is_active: true,
    showtimes: [
      {
        id: 1,
        is_active: true,
        movies: {
          id: 1,
          title: 'Inception 2',
        },
      },
    ],
  };

  // --------------------------- SHOW TIME ---------------------------

  static showtimeDate = {
    id: 1,
    name: 'VIP Hall 2',
    location: '1st Floor, Building A',
    total_seats: 120,
    is_active: true,
    showtimes: [
      {
        id: 1,
        is_active: true,
        movies: {
          id: 1,
          title: 'Inception 2',
          description: 'A mind-bending thriller about dreams within dreams.',
        },
      },
    ],
  };

  static showtimeAll = {
    id: 1,
    ticket_quantity: 100,
    start_time: '13:00:00',
    end_time: '15:00:00',
    is_active: true,
    room: {
      id: 1,
      name: 'VIP Hall 2',
      location: '1st Floor, Building A',
      is_active: true,
    },
    movies: {
      id: 1,
      createdAt: '2025-09-13T14:35:25.417Z',
      title: 'Inception 2',
    },
  };

  // --------------------------- WALLET ---------------------------

  static walletDate = {
    id: 3,
    createdAt: '2025-09-14T10:14:01.698Z',
    updatedAt: '2025-09-14T10:14:01.698Z',
    card_name: 'Visa Platinum',
    card_number: '1234567890123466',
    balance: 1000.5,
    phone_number: 998935720474,
    customer_id: 4,
  };

  static walletAll = {
    id: 3,
    card_number: '1234567890123466',
    balance: '1000.5',
    phone_number: '998935720474',
    customer: {
      id: 4,
      name: 'Alice Johnson',
      email: 'www.komol8679@gmail.com',
    },
  };
  // --------------------------- TICKET ---------------------------

  static ticketDate = {
    message: 'All tickets created',
    result: {
      firstTicket: {
        id: 121,
        createdAt: '2025-09-14T14:38:07.011Z',
        updatedAt: '2025-09-14T14:38:07.011Z',
        seat_number: 1,
        price: 15.5,
        showtime_id: 1,
        status: true,
        start_time: '13:00:00',
        end_time: '15:00:00',
      },
      lastTikect: {
        id: 240,
        createdAt: '2025-09-14T14:38:07.011Z',
        updatedAt: '2025-09-14T14:38:07.011Z',
        seat_number: 120,
        price: 15.5,
        showtime_id: 1,
        status: true,
        start_time: '13:00:00',
        end_time: '15:00:00',
      },
    },
    all_ticket_number: 120,
  };

  static ticketAll = {
    id: 348,
    seat_number: 108,
    price: '15.5',
    status: true,
    start_time: '13:00:00',
    end_time: '15:00:00',
  };

  static ticketOne = {
    id: 121,
    price: '15.5',
    status: true,
    start_time: '13:00:00',
    end_time: '15:00:00',
    showtime: {
      id: 1,
      is_active: true,
      room: {
        id: 1,
        name: 'VIP Hall 2',
        location: '1st Floor, Building A',
        total_seats: 120,
      },
      movies: {
        id: 1,
        title: 'Inception 2',
        description: 'A mind-bending thriller about dreams within dreams.',
      },
    },
  };

  // ----------------------------- ORDER -----------------------------------
  static orderDate = {
    id: 5,
    total_price: 77.5,
    quantity: 5,
    status: true,
    customer_id: 3,
    movie_id: 1,
  };
}
