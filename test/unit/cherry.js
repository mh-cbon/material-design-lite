
describe('cherry', function () {

  it('should be globally available', function () {
    expect(cherry).to.be.a('object');
  });

  it('should be able to get form values', function () {
    var form = document.createElement('form');

    var text = document.createElement('input');
    text.setAttribute('name', 'inputtext');
    text.setAttribute('type', 'text');
    text.setAttribute('value', 'inputtext');
    form.appendChild(text);

    var hidden = document.createElement('input');
    hidden.setAttribute('name', 'inputhidden');
    hidden.setAttribute('type', 'hidden');
    hidden.setAttribute('value', 'inputhidden');
    form.appendChild(hidden);

    var textarea = document.createElement('textarea');
    textarea.setAttribute('name', 'textarea');
    textarea.value = 'textarea'
    form.appendChild(textarea);

    var nonametext = document.createElement('input');
    nonametext.setAttribute('type', 'text');
    nonametext.setAttribute('value', 'nonametext');
    form.appendChild(nonametext);

    var selectnoopt = document.createElement('select');
    selectnoopt.setAttribute('name', 'selectnoopt');
    form.appendChild(selectnoopt);

    var selectopt = document.createElement('select');
    selectopt.setAttribute('name', 'selectopt');
    opt = document.createElement('option');
    opt.setAttribute('value', 'selectopt')
    opt.setAttribute('selected', 'selected')
    selectopt.appendChild(opt);
    form.appendChild(selectopt);

    var selectoptdef = document.createElement('select');
    selectoptdef.setAttribute('name', 'selectoptdef');
    opt = document.createElement('option');
    opt.setAttribute('value', 'selectoptdef')
    selectoptdef.appendChild(opt);
    form.appendChild(selectoptdef);

    var selectoptmul = document.createElement('select');
    selectoptmul.setAttribute('name', 'selectoptmul');
    selectoptmul.setAttribute('multiple', 'multiple');
    opt = document.createElement('option');
    opt.setAttribute('value', 'selectoptmul')
    opt.setAttribute('selected', 'selected')
    selectoptmul.appendChild(opt);
    opt = document.createElement('option');
    opt.setAttribute('value', 'selectoptmul1')
    opt.setAttribute('selected', 'selected')
    selectoptmul.appendChild(opt);
    opt = document.createElement('option');
    opt.setAttribute('value', 'selectoptmul2')
    selectoptmul.appendChild(opt);
    form.appendChild(selectoptmul);

    var textareaarray = document.createElement('textarea');
    textareaarray.setAttribute('name', 'textareaarray');
    textareaarray.value = 'textareaarray'
    form.appendChild(textareaarray);

    var textareaarray1 = document.createElement('textarea');
    textareaarray1.setAttribute('name', 'textareaarray');
    textareaarray1.value = 'textareaarray1'
    form.appendChild(textareaarray1);

    var submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('name', 'submit');
    submit.setAttribute('value', 'submit');
    submit.innerHTML = 'submit';
    form.appendChild(submit);

    var grep = document.createElement('input');
    grep.setAttribute('name', 'grep');
    grep.setAttribute('type', 'hidden');
    grep.setAttribute('value', 'cherry');
    form.appendChild(grep);

    var checkboxoptdef = document.createElement('input');
    checkboxoptdef.setAttribute('name', 'checkboxoptdef');
    checkboxoptdef.setAttribute('type', 'checkbox');
    checkboxoptdef.setAttribute('value', 'checkboxoptdef');
    form.appendChild(checkboxoptdef);

    var checkboxopt = document.createElement('input');
    checkboxopt.setAttribute('name', 'checkboxopt');
    checkboxopt.setAttribute('type', 'checkbox');
    checkboxopt.setAttribute('value', 'checkboxopt');
    form.appendChild(checkboxopt);
    var checkboxopt1 = document.createElement('input');
    checkboxopt1.setAttribute('name', 'checkboxopt');
    checkboxopt1.setAttribute('type', 'checkbox');
    checkboxopt1.setAttribute('value', 'checkboxopt1');
    checkboxopt1.setAttribute('checked', 'checked');
    form.appendChild(checkboxopt1);

    var checkboxoptmul = document.createElement('input');
    checkboxoptmul.setAttribute('name', 'checkboxoptmul');
    checkboxoptmul.setAttribute('type', 'checkbox');
    checkboxoptmul.setAttribute('value', 'checkboxoptmul');
    checkboxoptmul.setAttribute('checked', 'checked');
    form.appendChild(checkboxoptmul);
    var checkboxoptmul1 = document.createElement('input');
    checkboxoptmul1.setAttribute('name', 'checkboxoptmul');
    checkboxoptmul1.setAttribute('type', 'checkbox');
    checkboxoptmul1.setAttribute('value', 'checkboxoptmul1');
    checkboxoptmul1.setAttribute('checked', 'checked');
    form.appendChild(checkboxoptmul1);

    var radiodef = document.createElement('input');
    radiodef.setAttribute('name', 'radiodef');
    radiodef.setAttribute('type', 'radio');
    radiodef.setAttribute('value', 'radiodef');
    form.appendChild(radiodef);

    var radioopt = document.createElement('input');
    radioopt.setAttribute('name', 'radioopt');
    radioopt.setAttribute('type', 'radio');
    radioopt.setAttribute('value', 'radioopt');
    form.appendChild(radioopt);
    var radioopt1 = document.createElement('input');
    radioopt1.setAttribute('name', 'radioopt');
    radioopt1.setAttribute('type', 'radio');
    radioopt1.setAttribute('value', 'radioopt1');
    radioopt1.setAttribute('checked', 'checked');
    form.appendChild(radioopt1);

    var radiooptmul = document.createElement('input');
    radiooptmul.setAttribute('name', 'radiooptmul');
    radiooptmul.setAttribute('type', 'radio');
    radiooptmul.setAttribute('value', 'radiooptmul');
    radiooptmul.setAttribute('checked', 'checked');
    form.appendChild(radiooptmul);
    var radiooptmul1 = document.createElement('input');
    radiooptmul1.setAttribute('name', 'radiooptmul');
    radiooptmul1.setAttribute('type', 'radio');
    radiooptmul1.setAttribute('value', 'radiooptmul1');
    radiooptmul1.setAttribute('checked', 'checked');
    form.appendChild(radiooptmul1);

    document.body.appendChild(form);

    var values = cherry.formValues(form);

    expect('inputtext' in values).to.be.eq(true);
    expect(values.inputtext).to.be.eq('inputtext');

    expect('inputhidden' in values).to.be.eq(true);
    expect(values.inputhidden).to.be.eq('inputhidden');

    expect('textarea' in values).to.be.eq(true);
    expect(values.textarea).to.be.eq('textarea');

    expect('nonametext' in values).to.be.eq(false);
    expect(values.nonametext).to.be.eq(undefined);

    expect('selectnoopt' in values).to.be.eq(false);
    expect(values.selectnoopt).to.be.eq(undefined);

    expect('selectopt' in values).to.be.eq(true);
    expect(values.selectopt).to.be.eq('selectopt');

    expect('selectoptdef' in values).to.be.eq(true);
    expect(values.selectoptdef).to.be.eq('selectoptdef');

    expect('selectoptmul' in values).to.be.eq(true);
    expect(values.selectoptmul.length).to.be.eq(2);
    expect(values.selectoptmul[0]).to.be.eq('selectoptmul');
    expect(values.selectoptmul[1]).to.be.eq('selectoptmul1');

    expect('textareaarray' in values).to.be.eq(true);
    expect(values.textareaarray.length).to.be.eq(2);
    expect(values.textareaarray[0]).to.be.eq('textareaarray');
    expect(values.textareaarray[1]).to.be.eq('textareaarray1');

    expect('submit' in values).to.be.eq(true);
    expect(values.submit).to.be.eq('submit');

    expect('grep' in values).to.be.eq(true);
    expect(values.grep).to.be.eq('cherry');

    expect('checkboxoptdef' in values).to.be.eq(false);

    expect('checkboxopt' in values).to.be.eq(true);
    expect(values.checkboxopt).to.be.eq('checkboxopt1');

    expect('checkboxoptmul' in values).to.be.eq(true);
    expect(values.checkboxoptmul).to.be.eq('checkboxoptmul1');

    expect('radiodef' in values).to.be.eq(false);

    expect('radioopt' in values).to.be.eq(true);
    expect(values.radioopt).to.be.eq('radioopt1');

    expect('radiooptmul' in values).to.be.eq(true);
    expect(values.radiooptmul.length).to.be.eq(2);
    expect(values.radiooptmul[0]).to.be.eq('radiooptmul');
    expect(values.radiooptmul[1]).to.be.eq('radiooptmul1');

    form.remove();
  });

});
