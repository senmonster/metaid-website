import React from "react";
import cls from "classnames";

type IProps = {
	// onSubmit: (buzz: { content: string; images: AttachmentItem[] }) => void;

	feeRateOptions: {
		name: string;
		number: number;
	}[];
	selectFeeRate: {
		name: string;
		number: number;
	};
	setSelectFeeRate: React.Dispatch<
		React.SetStateAction<{
			name: string;
			number: number;
		}>
	>;
	handleCustomFeeChange: (v: string) => void;
	customFee: string;
};

const CustomFeerate = ({
	feeRateOptions,
	selectFeeRate,
	setSelectFeeRate,
	handleCustomFeeChange,
	customFee,
}: IProps) => {
	return (
		<div className="grid grid-cols-4 gap-2">
			{feeRateOptions.map((d) => {
				return (
					<div
						onClick={() => setSelectFeeRate(d)}
						key={d.name}
						className={cls(
							"shadow shadow-gray rounded-md p-2 cursor-pointer  bg-[var(--mantine-color-blue-light)]  hover:bg-gray/40 hover:border  hover:border-[var(--mantine-color-blue-5)]",
							{
								"bg-gray/40 border  border-[var(--mantine-color-blue-5)]":
									d.name === selectFeeRate.name,
							}
						)}
					>
						<div className="flex flex-col items-center gap-2  text-slate-400">
							<div className="text-slate-500">{d.name}</div>
							<div className="flex items-center gap-1">
								{d.name === "Custom" ? (
									<input
										inputMode="numeric"
										type="number"
										min={0}
										max={"100"}
										style={{
											appearance: "textfield",
										}}
										aria-hidden
										className="w-[50px] text-[16px]  bg-gray/40  shadow-inner !pr-0 border-none focus:border-main text-main focus:outline-none"
										step={1}
										value={customFee}
										onChange={(e) => {
											const v = e.currentTarget.value;
											handleCustomFeeChange(v);
											setSelectFeeRate({ ...d, number: Number(v) });
										}}
									/>
								) : (
									<div className="text-[16px] text-main">{d.number}</div>
								)}
								<div className="text-gray text-[12px] italic">sats/vB</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CustomFeerate;
