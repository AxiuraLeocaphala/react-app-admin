const userAgent = navigator.userAgent.toLowerCase();

export const User = {
    isMobile() {
        let typeStartPress, typeEndPress;
        const isMobile = /mobile|iphone|ipad|android|blackberry|mini|windows\sce|palm/i.test(userAgent);

        return isMobile
    },
}