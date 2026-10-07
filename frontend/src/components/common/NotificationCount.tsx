import { useEffect, useState } from "react";
import {
  notificationApi,
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/services/notificationApi";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import { createNotificationSSE } from "@/lib/notificationSse";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

const NotificationCount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, refetch } = useGetMyNotificationsQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [open, setOpen] = useState(false);

  const notificationList = data || [];
  const notiCount = notificationList.filter((noti) => !noti.isRead).length;

  const handleOpenChange = (nextOpen: boolean) => {
    // Khi tooltip chuyển từ mở -> đóng thì đánh dấu đã đọc
    if (!nextOpen && open && notiCount > 0) {
      markAllAsRead();
    }
    setOpen(nextOpen);
  };

  useEffect(() => {
    const eventSource = createNotificationSSE();

    const handleNewOrder = (event: MessageEvent) => {
      try {
        const newNoti = JSON.parse(event.data);

        // đẩy thẳng vào cache, không cần gọi lại API
        dispatch(
          notificationApi.util.updateQueryData(
            "getMyNotifications",
            undefined,
            (draft) => {
              draft.unshift(newNoti); // thêm vào đầu danh sách
            },
          ),
        );
      } catch (err) {
        console.error("Failed to parse SSE data, fallback to refetch:", err);
        refetch(); // fallback an toàn nếu parse lỗi
      }
    };

    eventSource.addEventListener("order:new", handleNewOrder);

    eventSource.onerror = () => {
      console.warn("SSE connection error, browser sẽ tự reconnect");
    };

    return () => {
      eventSource.close();
    };
  }, [refetch, dispatch]);

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Bell className="w-4 h-4 cursor-pointer" />
            {notiCount > 0 && (
              <span className="size-4 rounded-full flex justify-center items-center absolute -top-2.5 -right-2 bg-white text-primary text-xs">
                {notiCount}
              </span>
            )}
          </div>
          <span>Thông báo</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-250 px-0 flex flex-col items-start gap-0 bg-white text-black *:px-3 *:py-2 *:w-full *:hover:bg-gray-50 *:cursor-pointer text-sm border border-slate-200">
        {notificationList.length === 0 ? (
          <div className="w-100 h-20 flex justify-center items-center text-gray-400 text-sm">
            Không có thông báo nào
          </div>
        ) : (
          notificationList.map((noti) => (
            <div key={noti.id} className="text-gray-600 text-sm">
              Bạn có 1 đơn hàng mới vào lúc:{" "}
              {dayjs(noti.createdAt).format("HH[h]mm DD/MM/YYYY")}
            </div>
          ))
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default NotificationCount;
