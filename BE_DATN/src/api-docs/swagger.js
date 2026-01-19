/**
 Khi chạy, vào link http://localhost:3000/api-docs/ để mở Swagger
 Khi thêm 1 api mới vào swagger cần làm:
 - Thêm đường dẫn vào phần path, thêm các trường thông tin tương tự như mẫu dưới đây
 - Thêm schema trong phần component, để hiển thị mẫu trong phần request body
 */
/**
 "đường dẫn": {
                    "post": {
                        "tags": [" tên"],
                        "summary": "hướng dẫn",
                        "operationId": "định danh",
                        "parameters": [],
                        "requestBody": {
                            "description": "mô tả",
                            "content": { //Tham chiếu tới schema
                                "application/json": {"schema": {"$ref": "#/components/schemas/Users"}},
                                "application/xml": {"schema": {"$ref": "#/components/schemas/Users"}}
                            },
                            "required": true
                        },
                        "responses": {
                            "200": {"description": "create_document_success"},
                            "401": {"description": "create_document_false", "content": {}}
                        },
                        "x-codegen-request-body-name": "body"
                    }
                },
 */
                const swaggerJsonData =
                {
                    "openapi": "3.0.0",
                    "info": {
                        "title": "Api Project III",
                        "description": "Chứa danh sách các Api và test",
                        "contact": {"email": "anhduc10146@gmail.com"},
                        "version": "1.0.0"
                    },
                    "servers": [{"url": "http://localhost:8000"}],
                    "tags": [ {
                        "name": "Quản lý truyện tranh",
                        "description": "Bui Duc Duc"
                    }],
                    "paths": {
                        "/quan_tri_vien/login": {
                            "post": {
                                "tags": ["Quản trị viên"],
                                "summary": "Đăng nhập với tư cách là admin hoặc super-admin",
                                "operationId": "Login",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập thông tin tài khoản admin",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Users"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Users"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Đăng nhập thành công"},
                                    "400": {"description": "Đăng nhập thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },
                        "/quan_tri_vien/logout": {
                            "post": {
                                "tags": ["Quản trị viên"],
                                "summary": "Đăng xuất",
                                "operationId": "Logout",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập id tài khoản",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Logout DTO"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Logout DTO"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Đăng xuất thành công",},
                                    "400": {"description": "Đăng xuất thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },  
                        "/quan_tri_vien/capNhatTruyen": {
                            "post": {
                                "tags": ["Quản trị viên"],
                                "summary": "Cập nhật truyện",
                                "operationId": "",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập tên truyện và số tập cần cập nhật",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Cap nhat truyen"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Cap nhat truyen"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Cập nhật thành công",},
                                    "400": {"description": "Cập nhật thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },  
                        "/quan_tri_vien/taoTruyenMoi": {
                            "post": {
                                "tags": ["Quản trị viên"],
                                "summary": "Tạo truyện mới",
                                "operationId": "",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập các trường trong bảng tạo truyện mới",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/tao truyen moi"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/tao truyen moi"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Tạo truyện thành công",},
                                    "400": {"description": "Tạo truyện thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },  
                        "/thanh_vien/login": {
                            "post": {
                                "tags": ["Thành viên"],
                                "summary": "Đăng nhập với tư cách thành viên",
                                "operationId": "Login",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập thông tin tài khoản của thành viên",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Users"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Users"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Đăng nhập thành công"},
                                    "400": {"description": "Đăng nhập thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        }, 
                        "/thanh_vien/logout": {
                            "post": {
                                "tags": ["Thành viên"],
                                "summary": "Đăng xuất",
                                "operationId": "LogoutAuth",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập id tài khoản",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Logout DTO"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Logout DTO"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Đăng xuất thành công"},
                                    "400": {"description": "Đăng xuất thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },
                        "/thanh_vien/signIn": {
                            "post": {
                                "tags": ["Thành viên"],
                                "summary": "Tạo tài khoản",
                                "operationId": "",
                                "parameters": [],
                                "requestBody": {
                                    "description": "Nhập các trường có trong bảng signIn",
                                    "content": {
                                        "application/json": {"schema": {"$ref": "#/components/schemas/Sign In"}},
                                        "application/xml": {"schema": {"$ref": "#/components/schemas/Sign In"}}
                                    },
                                    "required": true
                                },
                                "responses": {
                                    "200": {"description": "Tạo tài khoản thành công"},
                                    "400": {"description": "Tạo tài khoản thất bại", "content": {}}
                                },
                                "x-codegen-request-body-name": "body"
                            }
                        },
                    },
                    "components": {
                        "schemas": {
                            "Users": {
                                "type": "object", "properties": {
                                    "taiKhoan":    {"type": "string"},
                                    "matKhau":     {"type": "string"}
                                }
                            },
                            "Logout DTO": {
                                "type": "object", "properties": {
                                    "_id": {"type": "string"},
                                }
                            },
                            "Sign In" : {
                                "type": "object", "properties": {
                                    "taiKhoan":    {"type": "string"},
                                    "matKhau":     {"type": "string"},
                                    "ten":         {"type": "string"},
                                    "tuoi":        {"type": "number"},
                                    "soDienThoai": {"type": "string"},
                                }
                            },
                            "Cap nhat truyen" : {
                                "type": "object", "properties": {
                                    "tenTruyen":    {"type": "string"},
                                    "tapSo":        {"type": "number"},
                                }
                            },
                            "tao truyen moi" : {
                                "type": "object", "properties": {
                                    "ten":                {"type": "string"},
                                    "soTap":              {"type": "number"},
                                    "tomTat":             {"type": "string"},
                                    "tacGia":             {"type": "string"},
                                    "theLoai":            {"type": "string"},
                                    "gioiHanQuyenDoc":    {"type": "string"},
                                    "gioiHanLuaTuoi":     {"type": "number"},
                                    "giaBanQuyen":        {"type": "number"}
                                }
                            }
                        }, "securitySchemes": {"bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}}
                    },
                    "security": [{"bearerAuth": []}]
                }
                exports.swaggerJsonData = swaggerJsonData;