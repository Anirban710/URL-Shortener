const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encode(num) {
    let base = chars.length;
    let str = "";

    while (num > 0) {
        str = chars[num % base] + str;
        num = Math.floor(num / base);
    }

    return str || "0";
}

module.exports = encode;
