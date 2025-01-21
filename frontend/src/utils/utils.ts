import dayjs from "dayjs";

export const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMM D, YYYY h:mm A");
};

export const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(num);
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
