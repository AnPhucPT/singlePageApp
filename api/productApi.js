import { getApiUrl } from '../utils/utils.js';
function productApi(app) {
    app.factory('productApi', function ($http) {
        return {
            filter(params) {
                return $http.get(getApiUrl('/public/products/filter'), {
                    params,
                });
            },
            minMax() {
                return $http.get(getApiUrl('/public/product/min-max'));
            },
        };
    });
}
export default productApi;
