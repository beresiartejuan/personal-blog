const orderByDate = (prev, current) => {
    return new Date(current.date) - new Date(prev.date)
};

export default orderByDate;