import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CheckOutPage() {
	//not sure if we'll be using these states, just setting them here as I work out how to display data from the customer fetches
	const { name, orderid } = useParams();
	const [customerDetails, setCustomerDetails] = useState(null);
	const [orderDetails, setOrderDetails] = useState(null);


	useEffect(() => {
		const fetchCustomerDetails = async () => {
			try {
				console.log("order", orderid);
				const url = `/api/product/checkout/${orderid}`;
				const response = await fetch(url);
				console.log(response);
				// const response = await fetch(`/api/product/checkout/${orderid}`);
				const data = await response.json();
				setCustomerDetails(data);
			} catch (error) {
				console.error('Error fetching user details:', error);
			}
		};

		fetchCustomerDetails();
	}, [orderid]);

	useEffect(() => {
		const fetchOrderDetails = async () => {
		try {
			const url = `api/product/${name}`
			console.log("username", name)
			const response = await fetch(url);
			console.log("order details", response)
			const data = await response.json();
			console.log('data', data);
			setOrderDetails(data);
		} catch (error) {
			console.error('Error fetching order details:', error);
		};}

		fetchOrderDetails();
	}, [orderid]);

	// Checkout button: handlePlaceOrderClick
	/* async function handlePlaceOrderClick(){

} */

	return (
		<>
			<div className="">
  <h2>Your Shipping Details</h2>
  {customerDetails && (
    <table>
      <tbody>
        <tr>
          <td>Name:</td>
          <td>{customerDetails.name}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{customerDetails.email}</td>
        </tr>
        <tr>
          <td>Address:</td>
          <td>{customerDetails.address}</td>
        </tr>
      </tbody>
    </table>
  )}
</div>

			<div>
				<h2>Order Summary</h2>
				<ul>
					{orderDetails &&
						orderDetails.orderLine.map((item, index) => (
							<li key={index}>
								<span>{item.product_id?.title}</span>
								<span>x {item.orderQty}</span>
								<span>${item.product_id.price * item.orderQty}</span>
							</li>
						))}
				</ul>
				<p>Total: ${orderDetails?.orderTotal}</p>
			</div>

			<div>
				<button /*  onClick={handlePlaceOrderClick} */>Place Order</button>
			</div>
		</>
	);
}
