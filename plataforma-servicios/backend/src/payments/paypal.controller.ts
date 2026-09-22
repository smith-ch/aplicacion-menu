import { Body, Controller, Get, NotImplementedException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/roles.decorator';

/**
 * Pasarela PayPal — pendiente de activación.
 *
 * Flujo previsto:
 *   1. POST /payments/paypal/orders   → crea la orden en PayPal por el monto de la factura.
 *   2. El cliente aprueba en el botón de PayPal (frontend).
 *   3. POST /payments/paypal/capture  → captura el pago, crea el Payment (validado)
 *      y llama a OrdersService.reviewPayment → Concrebill registra el pago y emite el recibo.
 */
@Controller('payments/paypal')
export class PaypalController {
  constructor(private readonly config: ConfigService) {}

  @Public() @Get('config')
  cfg() {
    const enabled = this.config.get('PAYPAL_ENABLED') === 'true';
    return { enabled, clientId: enabled ? this.config.get('PAYPAL_CLIENT_ID') : null, currency: 'USD' };
  }

  @Post('orders')
  createOrder(@Body() _body: { orderId: number; documentId?: number }) {
    throw new NotImplementedException('El pago con PayPal estará disponible próximamente');
  }

  @Post('capture')
  capture(@Body() _body: { paypalOrderId: string }) {
    throw new NotImplementedException('El pago con PayPal estará disponible próximamente');
  }
}
