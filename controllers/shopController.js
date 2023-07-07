function shopController(app) {
    const initialPagination = { page: 0, pageSize: 8 };
    const priceGap = 20;

    app.controller(
        'shopController',
        function ($scope, $rootScope, cartService, shopService) {
            $scope.searchParams = { ...initialPagination };
            $scope.resetProduct = () => {
                const { d_searchPrs, d_tagPrs } = shopService.defaultParams;
                $scope.searchParams = d_searchPrs;
                $scope.tagParams = { ...d_tagPrs, To: $scope.max };
                $scope.search = '';
            };

            $scope.deleteTag = (key) => {
                switch (key) {
                    case 'Search':
                        $scope.search = '';
                        break;
                    case 'Category':
                        $scope.tagParams['Category'] = 'All';
                        if ($scope.searchParams.hasOwnProperty('categoryId')) {
                            delete $scope.searchParams['categoryId'];
                            $scope.searchParams = { ...$scope.searchParams };
                        }
                        break;
                    case 'To':
                        $scope.max = $scope.maxValue;
                        $scope.searchParams = {
                            ...$scope.searchParams,
                            maxPrice: $scope.max,
                        };
                        $scope.tagParams = {
                            ...$scope.tagParams,
                            To: $scope.maxValue,
                        };
                        break;
                    case 'From':
                        $scope.min = 0;
                        $scope.searchParams = {
                            ...$scope.searchParams,
                            minPrice: $scope.min,
                        };
                        $scope.tagParams = {
                            ...$scope.tagParams,
                            From: 0,
                        };
                        break;
                    default:
                        console.log('key not exist');
                        break;
                }
            };

            $scope.getMinMax = async () => {
                const res = await shopService.getMinMax($scope.searchParams);
                const { max, tagParams } = res;
                $scope.maxValue = max;
                $scope.min = 0;
                $scope.max = max;
                $scope.tagParams = tagParams;
            };
            $scope.getMinMax();

            $scope.getFilterProduct = async () => {
                const res = await shopService.getProduct($scope.searchParams);
                const { getTotalPage, totalPage, totalItems, datas } = res;
                $scope.products = datas;
                $scope.totalPage = totalPage;
                $scope.totalItems = totalItems;
                $scope.getTotalPage = getTotalPage;
            };

            $scope.$watch('searchParams', function () {
                $scope.getFilterProduct();
            });

            $scope.$watch('search', function () {
                if ($scope.search) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: 0,
                        pageSize: $scope.searchParams.pageSize,
                        keyword: $scope.search,
                    };
                    $scope.tagParams = {
                        ...$scope.tagParams,
                        Search: '" ' + $scope.search + ' "',
                    };
                } else {
                    if ($scope.searchParams.keyword) {
                        delete $scope.searchParams.keyword;
                        delete $scope.tagParams.Search;
                        $scope.searchParams = { ...$scope.searchParams };
                        $scope.tagParams = { ...$scope.tagParams };
                    }
                }
            });

            $scope.$watch('max', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.max = $scope.min + priceGap;
                }
                $scope.RightValue =
                    100 - ($scope.max / $scope.maxValue) * 100 + '%';
            });

            $scope.$watch('min', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.min = $scope.max - priceGap;
                }

                $scope.LeftValue = ($scope.min / $scope.maxValue) * 100 + '%';
            });

            $scope.nextPage = () => {
                if ($scope.searchParams.page < $scope.totalPage - 1) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: ($scope.searchParams.page += 1),
                    };
                }
            };

            $scope.prevPage = () => {
                if ($scope.searchParams.page > 0) {
                    $scope.searchParams = {
                        ...$scope.searchParams,
                        page: ($scope.searchParams.page -= 1),
                    };
                }
            };

            $scope.changePage = (index) => {
                $scope.searchParams = {
                    ...$scope.searchParams,
                    page: index - 1,
                };
            };

            $scope.getProductByCategory_Id = (id, name) => {
                $scope.searchParams = {
                    ...initialPagination,
                    keyword: $scope.search,
                    categoryId: id,
                };
                if ($scope.search) {
                    $scope.tagParams = {
                        ...$scope.tagParams,
                        Search: '" ' + $scope.search + ' "',
                        Category: name,
                    };
                } else {
                    $scope.tagParams = {
                        ...$scope.tagParams,
                        Category: name,
                    };
                }
            };

            $scope.getProductByPriceRange = () => {
                $scope.tagParams = {
                    ...$scope.tagParams,
                    From: $scope.min,
                    To: $scope.max,
                };
                $scope.searchParams = {
                    ...$scope.searchParams,
                    minPrice: $scope.min,
                    maxPrice: $scope.max,
                };
            };

            $scope.addToCart = (product) => {
                cartService.addToCart(product);
                $rootScope.carts = cartService.getCartFromLS();
            };
        },
    );
}

export default shopController;
