"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value?: number;
  onChange?: (vlaue: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value = 1,
  onChange
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0])
  }
  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="Volume"
    >
      <RadixSlider.Track
        className="bg-neutral-600 h-[4px] cursor-pointer relative grow rounded-full">
          <RadixSlider.Range 
            className="absolute bg-white rounded-full h-full cursor-pointer"
          />
        </RadixSlider.Track>
          <RadixSlider.Thumb className="cursor-pointer block h-3 w-3 rounded-full  bg-green-500  shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-600 disabled:pointer-events-none disabled:opacity-50" />
    </RadixSlider.Root>
  )
}

export default Slider