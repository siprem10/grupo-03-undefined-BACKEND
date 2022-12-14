export function getExpiringDate(date) {
    date.setFullYear(date.getFullYear() + 3);
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().substr(-2);

    return `${month < 10 ? '0' + month : month}/${year}`;
}

export function getCardNum() {
    const random = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
    let cardNum = random.substring(0, 4) + " " + random.substring(4, 8) + " " + random.substring(8, 12) + " " +  random.substring(12, 16);
 
    return cardNum;
}