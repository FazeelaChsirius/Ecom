'use client'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from 'antd'

const StripePayments = () => {
  const stripe = useStripe()
  const elements = useElements()

  const confirmPay = async () => {
    if (!stripe || !elements) return

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/success',
      },
    })

    if (result.error) {
      console.log('failed', result.error.message)
    }
  }

  return (
    <div className="mt-6">
      <PaymentElement />
      <Button
        onClick={confirmPay}
        type="primary"
        size="large"
        className="mt-4"
      >
        Confirm Payment
      </Button>
    </div>
  )
}

export default StripePayments
