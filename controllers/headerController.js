function headerController(app) {
    app.controller(
        'headerController',
        function ($scope, $rootScope, cartService) {
            $scope.headerNavItem = [
                {
                    name: 'Home',
                    src: '/home',
                    active: $rootScope.activeRoute === 'home',
                },
                {
                    name: 'products',
                    src: '/products',
                    active: $rootScope.activeRoute === 'products',
                },
            ];

            $scope.dropDown = null;
            $scope.getInstance = () => {
                if (!$scope.dropDown) {
                    $scope.dropDown = $rootScope.initDropDown(
                        '#userDropDown',
                        '#trigger',
                    );
                }
                return $scope.dropDown;
            };
            $scope.toggleDropDown = () => {
                const dropDown = $scope.getInstance();
                setTimeout;
                if (dropDown.isVisible()) {
                    dropDown.show();
                } else {
                    dropDown.hide();
                }
            };

            $scope.isDarkTheme = false;
            if (
                localStorage.getItem('color-theme') === 'dark' ||
                (!('color-theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
                $scope.isDarkTheme = true;
            } else {
                $scope.isDarkTheme = false;
            }

            $scope.toggleTheme = () => {
                $scope.isDarkTheme = !$scope.isDarkTheme;
                // if set via local storage previously
                if (localStorage.getItem('color-theme')) {
                    if (localStorage.getItem('color-theme') === 'light') {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('color-theme', 'dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('color-theme', 'light');
                    }

                    // if NOT set via local storage previously
                } else {
                    if (document.documentElement.classList.contains('dark')) {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('color-theme', 'light');
                    } else {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('color-theme', 'dark');
                    }
                }
            };

            $scope.user = JSON.parse(localStorage.getItem('user')) || null;
            $scope.signOut = () => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                $scope.user = null;
                window.open('http://localhost:8080/', '_self');
            };
            $scope.carts = cartService.getCartFromLS();
            $scope.loading = false;
            $scope.getTotalQuantity = () => {
                return $scope.carts.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0,
                );
            };
        },
    );
}

export default headerController;
