const tip_options = document.querySelectorAll('#tip .options-container [type="button"]');
const bill = document.querySelector('#bill .input-container input');
const people = document.querySelector('#people .input-container input');
const custom_tip = document.querySelector('#tip .options-container [type="number"]');
const tip_result = document.querySelector('#results .tip .result');
const total_result = document.querySelector('#results .total .result');
const reset = document.querySelector('#results input');

const bill_invalid_number = document.querySelector('#bill .invalid-number');
const custom_tip_invalid_number = document.querySelector('#tip .invalid-number');
const people_invalid_number = document.querySelector('#people .invalid-number');

const bill_container = document.querySelector('#bill .input-container');
const people_container = document.querySelector('#people .input-container');

let option_selected_index = -1;
let bill_value, people_value, custom_tip_value;
let valid_bill_value, valid_custom_tip_value, valid_people_value;

function calcValues()
{
    bill_value = Number(bill.value);
    people_value = Number(people.value);
    custom_tip_value = Number(custom_tip.value);
    valid_bill_value = bill.value != '' && 0 <= bill_value;
    valid_custom_tip_value = custom_tip.value != '' && 0 <= custom_tip_value;
    valid_people_value = 0 < people_value && Number.isInteger(people_value);
}
function updateInvalidNumberMessage(valid, invalid_number, container)
{   
    if (valid)
    {
        invalid_number.innerText = '';
        container.classList.remove('invalid-number');
    }
    else
    {
        invalid_number.innerText = 'Invalid Number';
        container.classList.add('invalid-number');
    }
}
function removeSelectedButton()
{
    if (0 <= option_selected_index)
    {
        tip_options[option_selected_index].classList.remove('selected');
        option_selected_index = -1;
    }
}
function calcResults()
{
    let total = 0;
    let tip = 0;
    if (valid_bill_value && (0 <= option_selected_index || valid_custom_tip_value) && valid_people_value)
    {
        total = bill_value / people_value;
        if (0 <= option_selected_index)
            tip = total * parseInt(tip_options[option_selected_index].value) / 100;
        else
            tip = total * custom_tip_value / 100;
        total += tip;
        reset.classList.add('active');
    }
    else if (reset.classList.contains('active'))
        reset.classList.remove('active');
    total_result.innerText = '$' + total.toFixed(2);
    tip_result.innerText = '$' + tip.toFixed(2);
}

bill.addEventListener('change', () =>
{
    calcValues();
    updateInvalidNumberMessage(valid_bill_value, bill_invalid_number, bill_container);
    calcResults();
}
);
for (let i=0; i<tip_options.length; i++)
    tip_options[i].addEventListener('click', () => 
    {
        calcValues();
        for (let j=0; j<tip_options.length; j++)
            if (i!=j && tip_options[j].classList.contains('selected'))
                tip_options[j].classList.remove('selected');
        tip_options[i].classList.toggle('selected');
        option_selected_index = tip_options[i].classList.contains('selected') ? i : -1;
        if (0 <= option_selected_index && custom_tip.value != '')
        {
            custom_tip.value = '';
            updateInvalidNumberMessage(custom_tip.value == '' || 0 <= custom_tip_value, custom_tip_invalid_number, custom_tip);
        }
        calcResults();
    }
    );
custom_tip.addEventListener('change', () =>
{
    calcValues();
    updateInvalidNumberMessage(custom_tip.value == '' || 0 <= custom_tip_value, custom_tip_invalid_number, custom_tip);
    removeSelectedButton();
    calcResults();
}
);
people.addEventListener('change', () =>
{
    calcValues();
    updateInvalidNumberMessage(valid_people_value, people_invalid_number, people_container);
    calcResults();
});
reset.addEventListener('click', () =>
{
    if (reset.classList.contains('active'))
    {
        bill.value = '';
        custom_tip.value = '';
        people.value = '';
        removeSelectedButton();
        total_result.innerText = '$0.00';
        tip_result.innerText = '$0.00';
        reset.classList.remove('active');
    }
}
)

