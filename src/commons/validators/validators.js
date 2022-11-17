function Validate(value, rules) {


    function requiredValidator(value) {
        return value.trim() !== '';
    }

    function minLengthValidator(value, minLength) {
        return value.length >= minLength;
    }

    function maxLengthValidator(value, maxLength) {
        return value.length <= maxLength;
    }

    function emailValidator(value) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }

    function minValueValidator(value, minValue) {
        return value >= minValue;
    }

    let isValid = true;
    let errorMessages = [];
    let currentValue = false;

    for (let rule in rules) {

        switch (rule) {
            case 'isRequired':
                currentValue = requiredValidator(value);
                if (!currentValue) {errorMessages.push("Required value")};
                break;
            case 'minLength':
                currentValue = minLengthValidator(value, rules[rule]);
                if (!currentValue) {errorMessages.push("Minimum length: " + rules[rule])};
                break;
            case 'maxLength':
                currentValue = maxLengthValidator(value, rules[rule]);
                if (!currentValue) {errorMessages.push("Maximum length: " + rules[rule])};
                break;
            case 'email':
                currentValue = emailValidator(value);
                if (!currentValue) {errorMessages.push("Must be a valid email address")};
                break;
            case 'minValue':
                currentValue = minValueValidator(value, rules[rule]);
                if (!currentValue) {errorMessages.push("Must be a value >= " + rules[rule])};
                break;
            default: isValid = true;
        }

        isValid = isValid && currentValue;
    }

    return {"valid": isValid, "errorMessages": errorMessages};
};

export default Validate;
