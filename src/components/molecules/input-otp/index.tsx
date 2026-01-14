import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/atoms/input-otp'
import { cn } from '@/lib/utils'

export interface OTPInputProps {
  /**
   * The value of the OTP input
   */
  value?: string
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void
  /**
   * Number of OTP slots
   * @default 6
   */
  maxLength?: number
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Pattern to match (e.g., '^[0-9]*$' for numbers only)
   */
  pattern?: string
}

/**
 * OTPInput molecule component for entering one-time passwords
 *
 * @example
 * ```tsx
 * <OTPInput
 *   value={otp}
 *   onChange={setOtp}
 *   maxLength={6}
 * />
 * ```
 */
export function OTPInput({
  value,
  onChange,
  maxLength = 6,
  className,
  disabled,
  pattern,
}: OTPInputProps) {
  return (
    <InputOTP
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      disabled={disabled}
      pattern={pattern}
      className={cn(className)}
    >
      <InputOTPGroup>
        {Array.from({ length: maxLength }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
