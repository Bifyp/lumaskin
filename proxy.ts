import createMiddleware from 'next-intl/middleware';
import {routing} from 'src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(pl|ru|uk|en)',
    '/(pl|ru|uk|en)/((?!api|_next).*)',

    // ДОБАВЛЯЕМ ЭТИ ПУТИ
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
};
