import { reactive, computed } from "vue";

export type TType = "info" | "warning" | "error" | "success";

interface INotification {
  title: string;
  closeText?: string;
  message: string;
  timeout?: number;
  type?: TType;
}

interface INotificationExtended extends INotification {
  id: string;
}

const notifications = reactive<INotificationExtended[]>([]);

const useNotifications = () => {
  const isActive = computed(() => notifications.length > 0);

  const removeNotification = (id: string) => {
    const index = notifications.findIndex(
      (notification) => notification.id === id
    );

    notifications.splice(index, 1);
  };

  const openNotification = (props: INotification) => {
    const id = `${Math.floor(Math.random() * Date.now()) + props.title}`;

    notifications.push({ ...props, id });

    if (props.timeout) {
      setTimeout(() => {
        removeNotification(id);
      }, props.timeout);
    }
  };

  const closeNotification = (id: string) => {
    removeNotification(id);
  };

  return {
    isActive,
    notifications,
    openNotification,
    closeNotification,
  };
};

export default useNotifications;
