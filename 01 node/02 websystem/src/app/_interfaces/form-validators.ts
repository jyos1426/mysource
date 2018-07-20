import { Directive, Input, forwardRef } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

const REQUIRED_VALIDATOR = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => RequiredValueValidator),
	multi: true
};

@Directive({
	selector: '[required][ngModel]',
	providers: [REQUIRED_VALIDATOR]
})

export class RequiredValueValidator implements Validator {
	validate(control: AbstractControl): { [key: string]: any } {
		const value = control.value;
		if (!value)	return { 'required': `값을 입력해 주세요` }
		else return null;
	}
}

const MIN_VALIDATOR = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => MinNumValueValidator),
	multi: true
};

@Directive({
	selector: '[min][ngModel]',
	providers: [MIN_VALIDATOR]
})

export class MinNumValueValidator implements Validator {
	@Input() min: string;

	validate(control: AbstractControl): { [key: string]: any } {
		if (this.min != null) {
			const min = Number.parseInt(this.min, 10);
			return control.value >= min ? null : {
				'min': `${this.min} 이상의 값을 입력하세요`
			};
		}
		return null;
	}
}

const MAX_VALIDATOR = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => MaxNumValueValidator),
	multi: true
};

@Directive({
	selector: '[max][ngModel]',
	providers: [MAX_VALIDATOR]
})

export class MaxNumValueValidator implements Validator {
	@Input() max: string;

	validate(control: AbstractControl): { [key: string]: any } {
		if (this.max != null) {
			const max = Number.parseInt(this.max, 10);
			return control.value <= max ? null : {
				'max': `${this.max} 이하의 값을 입력하세요`
			};
		}
		return null;
	}
}

