function homeController(app) {
    app.controller('homeController', function ($scope, cartService) {
        $scope.products = cartService.getCartFromLS();
        $scope.getTotalQuantity = () => {
            return $scope.products.reduce(
                (acc, curr) => acc + curr.quantity,
                0,
            );
        };
        $scope.user = JSON.parse(localStorage.getItem('user')) || null;
        $scope.signOut = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            $scope.user = null;
            window.open('http://localhost:8080/', '_self');
        };

        // new Splide('#banner', {
        //     type: 'loop',
        //     perPage: 1,
        //     perMove: 1,
        //     gap: 10,
        //     padding: '10%',
        //     arrows: true,
        //     pagination: true,
        //     focus: 'center',
        //     drag: 'free',
        //     snap: true,
        // }).mount();

        // new Splide('#TopSell', {
        //     type: 'loop',
        //     perPage: 5,
        //     breakpoints: {
        //         1100: {
        //             perPage: 2,
        //             gap: 20,
        //         },
        //     },
        //     gap: 20,
        //     perMove: 1,
        //     arrows: true,
        //     pagination: false,
        //     focus: 'center',
        //     drag: 'free',
        //     snap: true,
        // }).mount();

        // new Splide('#blog', {
        //     type: 'loop',
        //     perPage: 2,
        //     breakpoints: {
        //         1100: {
        //             perPage: 1,
        //             gap: 20,
        //         },
        //     },
        //     padding: '10%',
        //     gap: 100,
        //     perMove: 1,
        //     arrows: true,
        //     pagination: true,
        //     focus: 'center',
        //     drag: 'free',
        //     snap: true,
        // }).mount();

        // new Splide('#brand', {
        //     type: 'loop',
        //     perPage: 7,
        //     perMove: 1,
        //     arrows: false,
        //     snap: true,
        //     breakpoints: {
        //         1000: {
        //             perPage: 4,
        //         },
        //         700: {
        //             perPage: 3,
        //         },
        //     },
        //     focus: 'center',
        //     drag: 'free',
        //     autoplay: true,
        // }).mount();
    });
}

export default homeController;
