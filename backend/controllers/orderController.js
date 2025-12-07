import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";

export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;
  if (
    !full_name ||
    !state ||
    !city ||
    !country ||
    !address ||
    !pincode ||
    !phone
  ) {
    return next(
      new ErrorHandler("Please provide complete shipping details.", 400)
    );
  }

  const items = Array.isArray(orderedItems)
    ? orderedItems
    : JSON.parse(orderedItems);

  if (!items || items.length === 0) {
    return next(new ErrorHandler("No items in cart.", 400));
  }
  const productIds = items.map((item) => item.product.id);
  const { rows: products } = await database.query(
    `SELECT id, price, stock, name FROM products WHERE id = ANY($1::uuid[])`,
    [productIds]
  );

  let total_price = 0;
  const values = [];
  const placeholders = [];

  items.forEach((item, index) => {
    const product = products.find((p) => p.id === item.product.id);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found for ID: ${item.product.id}`, 404)
      );
    }

    if (item.quantity > product.stock) {
      return next(
        new ErrorHandler(
          `Only ${product.stock} units available for ${product.name}`,
          400
        )
      );
    }

    const itemTotal = product.price * item.quantity;
    total_price += itemTotal;

    values.push(
      null,
      product.id,
      item.quantity,
      product.price,
      item.product.images[0].url || "",
      product.name
    );

    const offset = index * 6;

    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5
      }, $${offset + 6})`
    ); //$1 $2 $3 ....
  });

  const tax_price = 0.18;
  const shipping_price = total_price >= 50 ? 0 : 2;
  total_price = Math.round(
    total_price + total_price * tax_price + shipping_price
  );

  const orderResult = await database.query(
    `INSERT INTO orders (buyer_id, total_price, tax_price, shipping_price) VALUES ($1, $2, $3, $4) RETURNING *`,
    [req.user.id, total_price, tax_price, shipping_price]
  );

  const orderId = orderResult.rows[0].id;

  for (let i = 0; i < values.length; i += 6) {
    values[i] = orderId;
  }

  await database.query(
    `
    INSERT INTO order_items (order_id, product_id, quantity, price, image, title)
    VALUES ${placeholders.join(", ")} RETURNING *
    `,
    values
  );

  // Update stock for each product
  for (const item of items) {
    const product = products.find((p) => p.id === item.product.id);
    if (product) {
      await database.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product.id]
      );
    }
  }

  await database.query(
    `
    INSERT INTO shipping_info (order_id, full_name, state, city, country, address, pincode, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `,
    [orderId, full_name, state, city, country, address, pincode, phone]
  );

  const { paymentMethod } = req.body;
  console.log("PlaceOrder Request Body keys:", Object.keys(req.body));
  console.log("Payment Method received:", paymentMethod);

  if (paymentMethod?.toLowerCase() === 'cod') {
    await database.query(
      "INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [orderId, "Cash on Delivery", "Pending", "COD"]
    );

    return res.status(200).json({
      success: true,
      message: "Order placed successfully (COD).",
      total_price,
    });
  }

  const paymentResponse = await generatePaymentIntent(orderId, total_price);

  if (!paymentResponse.success) {
    return next(new ErrorHandler("Payment failed. Try again.", 500));
  }

  res.status(200).json({
    success: true,
    message: "Order placed successfully. Please proceed to payment.",
    paymentIntent: paymentResponse.clientSecret,
    total_price,
  });
});

export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const result = await database.query(
    `
    SELECT 
      o.*, 
      COALESCE(
      json_agg(
      json_build_object(
      'order_item_id', oi.id,
      'order_id', oi.order_id,
      'product_id', oi.product_id,
      'quantity', oi.quantity,
      'price', oi.price
      )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS order_items,
      json_build_object(
      'full_name', s.full_name,
      'state', s.state,
      'city', s.city,
      'country', s.country,
      'address', s.address,
      'pincode', s.pincode,
      'phone', s.phone
      ) AS shipping_info
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      WHERE o.id = $1
      GROUP BY o.id, s.id;
`,
    [orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order fetched.",
    orders: result.rows[0],
    // orderId: orderId,
  });
});

export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(
    `
        SELECT o.*, COALESCE(
            json_agg(
              json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', oi.image,
            'title', oi.title
              )
            ) FILTER (WHERE oi.id IS NOT NULL), '[]'
            ) AS order_items,
            json_build_object(
            'full_name', s.full_name,
            'state', s.state,
            'city', s.city,
            'country', s.country,
            'address', s.address,
            'pincode', s.pincode,
            'phone', s.phone
            ) AS shipping_info
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN shipping_info s ON o.id = s.order_id
            WHERE o.buyer_id = $1
            GROUP BY o.id, s.id
        `,
    [req.user.id]
  );

  res.status(200).json({
    success: true,
    message: "All your orders are fetched.",
    myOrders: result.rows,
  });
});

//for ADMIN
export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const result = await database.query(`
            SELECT o.*,
              u.name as customer_name,
              p.payment_type,
              p.payment_status,
              s.city,
              COALESCE(json_agg(DISTINCT prod.category) FILTER (WHERE prod.id IS NOT NULL), '[]') as categories,
              COALESCE(json_agg(
              json_build_object(
              'order_item_id', oi.id,
              'order_id', oi.order_id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'image', oi.image,
              'title', COALESCE(oi.title, prod.name, 'Product')
              )
              ) FILTER (WHERE oi.id IS NOT NULL), '[]' ) AS order_items, json_build_object(
              'full_name', s.full_name,
              'state', s.state,
              'city', s.city,
              'country', s.country,
              'address', s.address,
              'pincode', s.pincode,
              'phone', s.phone 
              ) AS shipping_info
              FROM orders o
              LEFT JOIN users u ON o.buyer_id = u.id
              LEFT JOIN payments p ON o.id = p.order_id
              LEFT JOIN order_items oi ON o.id = oi.order_id
              LEFT JOIN products prod ON oi.product_id = prod.id
              LEFT JOIN shipping_info s ON o.id = s.order_id
              GROUP BY o.id, u.id, p.id, s.id
              ORDER BY o.created_at DESC
        `);

  res.status(200).json({
    success: true,
    message: "All orders fetched.",
    orders: result.rows,
  });
});

export const fetchOrderStats = catchAsyncErrors(async (req, res, next) => {
  // 1. Total Revenue
  const revenueResult = await database.query(
    "SELECT COALESCE(SUM(total_price), 0) as total_revenue FROM orders"
  );

  // 2. Total Customers (unique buyers)
  const customersResult = await database.query(
    "SELECT COUNT(DISTINCT buyer_id) as total_customers FROM orders"
  );

  // 3. Total Transactions (total orders)
  const transactionsResult = await database.query(
    "SELECT COUNT(*) as total_transactions FROM orders"
  );

  // 4. Total Products (distinct products sold or total products in catalog? Usually catalog size or items sold. Let's do catalog size as per common dashboard stats)
  const productsResult = await database.query(
    "SELECT COUNT(*) as total_products FROM products"
  );

  // 5. Status distribution
  const statusResult = await database.query(`
    SELECT 
      COUNT(*) FILTER (WHERE order_status = 'Processing') as processing,
      COUNT(*) FILTER (WHERE order_status = 'Shipped') as shipped,
      COUNT(*) FILTER (WHERE order_status = 'Delivered') as delivered,
      COUNT(*) FILTER (WHERE order_status = 'Cancelled') as cancelled
    FROM orders
  `);

  res.status(200).json({
    success: true,
    stats: {
      totalRevenue: parseFloat(revenueResult.rows[0].total_revenue),
      totalCustomers: parseInt(customersResult.rows[0].total_customers),
      totalTransactions: parseInt(transactionsResult.rows[0].total_transactions),
      totalProducts: parseInt(productsResult.rows[0].total_products),
      statusCounts: {
        Processing: parseInt(statusResult.rows[0].processing),
        Shipped: parseInt(statusResult.rows[0].shipped),
        Delivered: parseInt(statusResult.rows[0].delivered),
        Cancelled: parseInt(statusResult.rows[0].cancelled),
      }
    }
  });
});

export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  if (!status) {
    return next(new ErrorHandler("Provide a valid status for order.", 400));
  }
  const { orderId } = req.params;
  const results = await database.query(
    `
    SELECT * FROM orders WHERE id = $1
    `,
    [orderId]
  );

  if (results.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  const updatedOrder = await database.query(
    `
    UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *
    `,
    [status, orderId]
  );

  res.status(200).json({
    success: true,
    message: "Order status updated.",
    updatedOrder: updatedOrder.rows[0],
  });
});

export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const results = await database.query(
    `
        DELETE FROM orders WHERE id = $1 RETURNING *
        `,
    [orderId]
  );
  if (results.rows.length === 0) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted.",
    order: results.rows[0],
  });
});
