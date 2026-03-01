import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Booking {
  id: string;
  date: Date;
  time: string;
  serviceName: string;
  specialistName: string | null;
  status: string;
  price: number | null;
  createdAt: Date;
}

export default async function AccountPage() {
  const locale = await getLocale(); // ← Локаль всегда есть
  const t = await getTranslations("AccountPage");

  const session = await auth();
  if (!session?.user) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        orderBy: { date: "desc" }
      }
    }
  });

  if (!user) notFound();

  const bookings: Booking[] = user.bookings.map((b: any) => ({
    id: b.id,
    date: b.date,
    time: b.time,
    serviceName: b.serviceName,
    specialistName: b.specialistName ?? null,
    status: b.status,
    price: b.price ?? null,
    createdAt: b.createdAt,
  }));

  const upcomingBookings = bookings.filter(
    (b: Booking) =>
      b.status !== "cancelled" && new Date(b.date) > new Date()
  );

  const pastBookings = bookings.filter(
    (b: Booking) =>
      b.status === "completed" || new Date(b.date) < new Date()
  );

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">

      {/* Заголовок */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-graphite mb-4">
          {t("title")}
        </h1>
        <p className="text-graphite/60 text-lg">
          {t("subtitle")}
        </p>
        <div className="w-24 h-px bg-gold mx-auto mt-6"></div>
      </div>

      {/* Профиль */}
      <div className="bg-white border border-gold/20 rounded-xl shadow-lg p-10 mb-16">
        <div className="flex items-center justify-between flex-wrap gap-6">

          {/* Аватар */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gold text-white flex items-center justify-center text-3xl font-serif shadow-md">
              {user.name?.charAt(0).toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-serif text-graphite">
                {user.name || t("profile.guest")}
              </h2>
              <p className="text-graphite/60">{user.email}</p>
            </div>
          </div>

          {/* Кнопка настроек */}
          <Link
            href={`/${locale}/account/settings`}
            className="text-sm tracking-wide uppercase text-gold hover:text-graphite transition"
          >
            {t("profile.editButton")}
          </Link>
        </div>

        {/* Админ-кнопка */}
        {user.role === "admin" && (
          <div className="mt-8">
            <Link
              href={`/${locale}/admin`}
              className="inline-block bg-graphite text-white px-6 py-3 rounded-md text-sm tracking-wider hover:bg-black transition"
            >
              {t("admin.button")}
            </Link>
          </div>
        )}
      </div>

      {/* Предстоящие записи */}
      {upcomingBookings.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-graphite mb-6">
            {t("bookings.upcoming")}
          </h2>

          <div className="space-y-6">
            {upcomingBookings.map((booking: Booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gold/20 rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-serif text-graphite">
                      {booking.serviceName}
                    </h3>
                    <p className="text-graphite/60 text-sm">
                      {booking.specialistName}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {t(`bookings.statuses.${booking.status}`)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-graphite/70">
                  <div>
                    {new Date(booking.date).toLocaleDateString("ru-RU")}
                  </div>
                  <div>{booking.time}</div>
                  {booking.price && (
                    <div className="font-semibold text-graphite">
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        maximumFractionDigits: 0
                      }).format(booking.price)}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  <Link
                    href={`/${locale}/booking/${booking.id}/reschedule`}
                    className="text-sm text-gold hover:text-graphite transition"
                  >
                    {t("bookings.actions.reschedule")}
                  </Link>

                  <button className="text-sm text-red-500 hover:text-red-700 transition">
                    {t("bookings.actions.cancel")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* История */}
      <div>
        <h2 className="text-3xl font-serif text-graphite mb-6">
          {t("bookings.history")}
        </h2>

        {pastBookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gold/20 rounded-xl shadow-md">
            <p className="text-graphite/60">{t("bookings.empty")}</p>
            <Link
              href={`/${locale}/booking`}
              className="mt-4 inline-block text-gold hover:text-graphite transition font-medium"
            >
              {t("bookings.makeFirst")} →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pastBookings.map((booking: Booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gold/20 rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-serif text-graphite">
                  {booking.serviceName}
                </h3>

                <p className="text-sm text-graphite/60 mt-1">
                  {new Date(booking.date).toLocaleDateString("ru-RU")} •{" "}
                  {booking.time}
                </p>

                {booking.price && (
                  <p className="font-semibold text-graphite mt-2">
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                      maximumFractionDigits: 0
                    }).format(booking.price)}
                  </p>
                )}

                <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                  {t(`bookings.statuses.${booking.status}`)}
                </span>

                {booking.status === "completed" && (
                  <Link
                    href={`/${locale}/booking?service=${booking.serviceName}`}
                    className="text-sm text-gold hover:text-graphite mt-3 inline-block transition"
                  >
                    {t("bookings.actions.bookAgain")} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
