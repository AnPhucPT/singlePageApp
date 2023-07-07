function shopController(app) {
    const initialPagination = { page: 0, pageSize: 8 };
    const priceGap = 20;

    app.controller(
        'shopController',
        function ($scope, $rootScope, cartService, shopService) {
            //init max, tagParam
            $scope.getMinMax = async () => {
                const res = await shopService.getMinMax();
                const { max, tagParams } = res;
                $scope.maxValue = max;
                $scope.min = 0;
                $scope.max = max;
                $scope.tagParams = tagParams;
            };
            $scope.getMinMax();

            //Reset default
            $scope.searchParams = { ...initialPagination };
            $scope.resetProduct = () => {
                const { defaultSearchParams, defaultTagParams } =
                    shopService.defaultParams;
                $scope.searchParams = { ...defaultSearchParams };
                $scope.tagParams = { ...defaultTagParams, To: $scope.max };
                console.log($scope.tagParams);
                $scope.search = '';
            };

            //filter product & handlePage
            let handlePage;
            $scope.getFilterProduct = async () => {
                const res = await shopService.getProduct($scope.searchParams);
                const { getTotalPage, totalPage, totalItems, datas } = res;
                $scope.products = [...datas];
                $scope.totalPage = totalPage;
                $scope.totalItems = totalItems;
                $scope.getTotalPage = getTotalPage;

                handlePage = shopService.handlePage(
                    $scope.searchParams,
                    $scope.totalPage,
                );
            };

            // TagParam
            $scope.deleteTag = (key) => {
                switch (key) {
                    case 'Search':
                        $scope.search = '';
                        break;
                    case 'Category':
                        $scope.tagParams['Category'] = 'All';
                        delete $scope.searchParams.categoryId;
                        $scope.searchParams = { ...$scope.searchParams };
                        break;
                    case 'To':
                        $scope.max = $scope.maxValue;
                        $scope.getProductByPriceRange();
                        break;
                    case 'From':
                        $scope.min = 0;
                        $scope.getProductByPriceRange();
                        break;
                    default:
                        console.log('key not exist');
                        break;
                }
            };

            $scope.$watch('searchParams', function () {
                $scope.getFilterProduct();
            });

            $scope.$watch('search', function () {
                if (!!($scope.tagParams || $scope.search)) {
                    const { searchParams, tagParams } = shopService.getSearch(
                        $scope.searchParams,
                        $scope.tagParams,
                        $scope.search,
                    );
                    $scope.searchParams = { ...searchParams };
                    $scope.tagParams = { ...tagParams };
                }
            });

            $scope.$watch('max', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.max = $scope.min + priceGap;
                }
                $scope.RightValue =
                    100 - ($scope.max / $scope.maxValue) * 100 + '%';
                $scope.initGetProductByPriceRange();
            });

            $scope.$watch('min', function () {
                if ($scope.max - $scope.min < priceGap) {
                    $scope.min = $scope.max - priceGap;
                }
                $scope.LeftValue = ($scope.min / $scope.maxValue) * 100 + '%';
                $scope.initGetProductByPriceRange();
            });

            $scope.nextPage = () => {
                $scope.searchParams = { ...handlePage.nextPage() };
            };

            $scope.prevPage = () => {
                $scope.searchParams = { ...handlePage.prevPage() };
            };

            $scope.changePage = (index) => {
                $scope.searchParams = { ...handlePage.changePage(index) };
            };

            $scope.getProductByCategory_Id = (id, name) => {
                const getProductByCategory_Id =
                    shopService.getProductByCategory_Id(
                        $scope.tagParams,
                        $scope.searchParams,
                        id,
                        name,
                        $scope.search,
                    );
                $scope.searchParams = {
                    ...getProductByCategory_Id.searchParams,
                };
                $scope.tagParams = { ...getProductByCategory_Id.tagParams };
            };

            let getProductByPriceRange;
            $scope.initGetProductByPriceRange = () => {
                getProductByPriceRange = shopService.getProductByPriceRange(
                    $scope.tagParams,
                    $scope.searchParams,
                    $scope.min,
                    $scope.max,
                );
            };

            $scope.getProductByPriceRange = () => {
                $scope.tagParams = { ...getProductByPriceRange.tagParams() };
                $scope.searchParams = {
                    ...getProductByPriceRange.searchParams(),
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
