export const addOrder = (data) => {
    const order = JSON.parse(localStorage.getItem('purchasedEvents')) || [];
    order.push(data);
    localStorage.setItem('purchasedEvents', JSON.stringify(order));

}