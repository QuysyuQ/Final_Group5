import { Routes } from '@angular/router';
import { LoginComponent } from './pages/admin/feature/auth/login/login.component';
import { HomeAdminComponent } from './pages/admin/feature/home-admin/home-admin/home-admin.component';
import { ProductListComponent } from './pages/admin/feature/product/product-list/product-list.component';
import { AddProductComponent } from './pages/admin/feature/product/add-product/add-product.component';
import { CategoriesListComponent } from './pages/admin/feature/category/categories-list/categories-list.component';
import { UpdateProductComponent } from './pages/admin/feature/product/update-product/update-product.component';
import { AddCustomerComponent } from './pages/admin/feature/customer/add-customer/add-customer.component';
import { CustomerListComponent } from './pages/admin/feature/customer/customer-list/customer-list.component';
import { UpdateCustomerComponent } from './pages/admin/feature/customer/update-customer/update-customer.component';
import { HeaderWebsiteComponent } from './pages/website/core/header-website/header-website.component';
import { IndexComponent } from './pages/website/feature/home/index/index.component';
import { WebsiteProductListComponent } from './pages/website/feature/home/website-product-list/website-product-list.component';
import { ProductDetailsComponent } from './pages/website/feature/home/product-details/product-details.component';
import { CartComponent } from './pages/website/feature/home/cart/cart.component';
import { OrderComponent } from './pages/website/feature/home/order/order.component';
import { LoginWebsiteComponent } from './pages/website/feature/auth/login-website/login-website.component';
import { ForgotPasswordComponent } from './pages/website/feature/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/website/feature/auth/register/register.component';
import { AccountComponent } from './pages/website/feature/auth/account/account.component';
import { Component } from '@angular/core';
import { OrderHistoryComponent } from './pages/website/feature/home/order-history/order-history.component';
import { OrderListComponent } from './pages/admin/feature/order/order-list/order-list.component';
import { authGuard } from './pages/admin/feature/auth/guards/auth.guard';
import { CheckoutComponent } from './pages/website/feature/home/checkout/checkout.component';


export const routes: Routes = [
    // login cho trang admin
    {
        path: 'login',
        component : LoginComponent
    },
    // trang chủ admin
    {
        path : 'admin/home',
        component : HomeAdminComponent,
        canActivate : [authGuard]
    },
    // trang khách hàng admin
    {
        path : 'admin/customer',
        component : CustomerListComponent,
        
    },
    {
        path : 'admin/customer/add',
        component : AddCustomerComponent,
        canActivate : [authGuard]
    },
    {
        path : 'admin/customer/update/:id',
        component : UpdateCustomerComponent,
        canActivate : [authGuard]
    },
    // trang product cho admin
    {
        path : 'admin/product',
        component : ProductListComponent,
        canActivate : [authGuard]
    },
    {
        path : 'admin/product/add',
        component : AddProductComponent,
        canActivate : [authGuard]
    },
    {
        path : 'admin/product/update/:id',
        component : UpdateProductComponent,
        canActivate : [authGuard]
    },
    // trang order cho admin
    {
        path : 'admin/order',
        component : OrderListComponent,
        canActivate : [authGuard]
    },
    // trang category admin
    {
        path : 'admin/category',
        component : CategoriesListComponent,
        canActivate : [authGuard]
    },

    //website

    // trang chủ
    {
        path:'',
        component : IndexComponent
    },
    // trang sản phẩm theo danh mục
    {
        path :'product/:categoryId',
        component : WebsiteProductListComponent
    },
    // trang chi tiết sản phẩm
    {
        path : 'product/:categoryId/:productId',
        component : ProductDetailsComponent
    },
    // trang giỏ hàng user
    {
        path : 'cart',
        component : CartComponent,
        canActivate : [authGuard]
    },

    // trang xác nhận mua hàng 
    {
        path : 'order',
        component : OrderComponent,
        canActivate : [authGuard]
    },
    // trang đăng ký, đăng nhập và quên mật khẩu của user
    {
        path : 'loginwebsite',
        component : LoginWebsiteComponent
    },
    {
        path : 'loginforgot',
        component : ForgotPasswordComponent
    },
    {
        path : 'loginregister',
        component : RegisterComponent
    },
    // trang thông tin tài khoản của người dùng
    {
        path : 'account',
        component : AccountComponent,
        canActivate : [authGuard]
    },
    // trang lịch sử mua  hàng
    {
        path : 'order-history',
        component : OrderHistoryComponent,
        canActivate : [authGuard]
    },
    // check out
    {
        path : 'checkout',
        component : CheckoutComponent,
        canActivate : [authGuard]
    }

];
