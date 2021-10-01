(function() {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function checkPasscode() {
    var passcode_input = document.querySelector("#mypassword")
    if (passcode_input.value.length < 8) {
        passcode_input.setCustomValidity("xxx")
    } else {
        passcode_input.setCustomValidity("")
    }
}

function checkMatch() {
    var passcode_input = document.querySelector("#mypassword")
    var passcode_input2 = document.querySelector("#mypassword2")
    if (passcode_input.value != passcode_input2.value) {
        passcode_input2.setCustomValidity("xxx")
    } else {
        passcode_input2.setCustomValidity("")
    }
}