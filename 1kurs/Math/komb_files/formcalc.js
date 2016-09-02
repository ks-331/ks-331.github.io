/**
 * User: shprota
 * Date: 15.03.11
 * Time: 19:40
 */

Element.implement({
    getValue: function(){
        switch(this.get('tag')){
            case 'select':
                var values = [];
                $each(this.options, function(option){
                    if (option.selected) values.push($pick(option.value, option.text));
                });
                return (this.multiple) ? values : values[0];
            case 'input': if (!(this.checked && ['checkbox', 'radio'].contains(this.type)) && !['hidden', 'text', 'password'].contains(this.type)) break;
            case 'textarea': return this.value;
        }
        return false;
    }
});

var SCalc = new Class({
    initialize: function(frm, formula, nsigns) {
        this.form = $(frm);
        this.formula = formula;
        this.nsigns = nsigns || 2;
        var _this = this;
        this.form.getElements('input, textarea, select').each(function(el){
            if(this.isFormulaPart(el)) {
                el.addEvent('change', _this.calcData.bind(_this));
                if(el.get('tag') == 'input' && (el.getAttribute('type') == 'radio' || el.getAttribute('type') == 'checkbox'))
                    el.addEvent('click', _this.calcData.bind(_this));

                if(el.getAttribute('type') == 'text' || el.get('tag') == 'select')
                    el.addEvent('keyup', _this.calcData.bind(_this));
            }
        }.bind(this));
        this.calcData();
    }
    ,isFormulaPart: function(el) {
        var isPart = false;
        var regexp = new RegExp('\{'+el.name+'\}');
        this.formula.each(function(formula){
            if(el.name && formula.match(regexp) !== null) {
                isPart = true;
                return false;
            }
        });
        return isPart;
    }
    ,calcData: function() {
        var vals = [];
        this.form.getElements('input, textarea, select').each(function(el) {
            if(el.name) {
                var v = el.getValue();
                if(v!==false)vals[el.name] = v;
            }
        });
        this.formula.each(function(formula){
            var wformula = formula;
            for(var fld in vals)
                if(typeof vals[fld] !== 'function')
                    wformula = wformula.replace(new RegExp('{'+fld+'}','gm'), vals[fld]?vals[fld].replace(',', '.'):0);
            wformula = wformula.replace(/\{.*?\}/g, '0');
            var result;
            try { result = eval(wformula); }
            catch(e) { result = NaN; }
            var rfield = formula.split('=')[0];
            if(rfield.trim())
              this.setResult(rfield, result);
        }.bind(this));
    }
    ,setResult: function(rfield, result) {
        if(isFinite(result))
        {
            var divider = Math.pow(10, this.nsigns);
            result = Math.round(result*divider)/divider;
            $(rfield).value=result;
            $(rfield+'_disp').set('text',result);
        }
        else
        {
            $(rfield+'_disp').set('text','');
            $(rfield).value=result;
        }
    }
});


window.addEvent('domready', function(){
    if(!$chk(__FC_FORMULA))return;
    var formCheck = new FormCheck('calcForm', {
        display: {
            keepFocusOnError: 0,
            showErrors: 1,
            checkValueIfEmpty: 0
        }
        ,regexp: {
            number : /^[-+]?\d*(\.|,)?\d+$/
        }
        ,submit: __FC_SUBMIT
    });
    new SCalc('calcForm', __FC_FORMULA);
    if(!__FC_SUBMIT){
        formCheck.addEvent('validateSuccess', function(){
            new Request.JSON({
                url: '/index.php'
                ,method: 'post'
                ,data: {
                    option: 'com_formcalc'
                    ,task: 'checkCaptcha'
                    ,format: 'raw'
                    ,captcha: formCheck.form.captcha.value
                }
                ,onSuccess: function(r) {
                    //var r = Json.evaluate(resp);
                    if(r.success)$('calcForm').submit();
                    else alert(__FC_CAPTCHA_TEXT);
                }
            }).send();
            //$('calcForm').submit();
        });
    }
});
