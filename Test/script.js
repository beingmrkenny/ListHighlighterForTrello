document.addEventListener('DOMContentLoaded', function () {

    $$('button')._.addEventListener('click', function () {

        var button = this;

        lhTest.toggleActive(button);

        var parentNodeId = button.parentNode.id;

        if (parentNodeId == 'HighlightMode') {

            $id('Tests').innerHTML = '';

            if (button.dataset.display) {
                all ($$('.display-toggle'), function (displayToggle) {
                    displayToggle.classList.add('display-none');
                });
            }

            if (button.dataset.active == 'on') {

                lhTest.displayTests(window[button.value]);

                if (button.dataset.display) {
                    $id(button.dataset.display).classList.remove('display-none');
                }

            }

        } else if (parentNodeId == 'ColorBlindMode') {
            all ($$('input[type="checkbox"]'), function (checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
        }

    });

});

class lhTest {

    static displayTests (criteria) {

        var tests = $id('Tests');

        for (let item in criteria) {
            let categoryChecks = criteria[item];
            let test = $html.getTemplate('Item');
            test.querySelector('h2').textContent = item;

            let table = test.querySelector('table');

            for (let category in categoryChecks) {
                let checks = categoryChecks[category];
                let testRow = $html.getTemplate('TestRow');
                testRow.querySelector('th').textContent = category;

                let ul = testRow.querySelector('ul');

                if (Array.isArray(checks)) {

                    for (let i = 0, x = checks.length; i < x; i++) {

                        let checklistItem = $html.getTemplate('ChecklistItem');
                        let label = checklistItem.querySelector('label');
                        let checkbox = checklistItem.querySelector('input');

                        let id = lhTest.createId(category + checks[i], i);
                        let check = document.createTextNode(checks[i]);

                        checkbox.setAttribute('id', id);
                        checkbox.setAttribute('name', id);
                        label.setAttribute('for', id);
                        label.appendChild(check);
                        ul.appendChild(checklistItem);
                    }

                } else {

                    for (let level in checks) {

                        let header = $dom.createElement(`<li><strong>${level}</strong></li>`);
                        let levelChecks = checks[level];

                        let subUl = document.createElement('ul');

                        for (let i = 0, x = levelChecks.length; i < x; i++) {

                            let checklistItem = $html.getTemplate('ChecklistItem');
                            let label = checklistItem.querySelector('label');
                            let checkbox = checklistItem.querySelector('input');

                            let id = lhTest.createId(category + levelChecks[i], i);

                            let check = document.createTextNode(levelChecks[i]);

                            checkbox.setAttribute('id', id);
                            checkbox.setAttribute('name', id);
                            label.setAttribute('for', id);
                            label.appendChild(check);

                            subUl.appendChild(checklistItem);

                        }

                        header.appendChild(subUl);

                        ul.appendChild(header);

                    }

                }

                table.appendChild(testRow);
            }

            tests.appendChild(test);
        }

        $$('input[type="checkbox"]')._.addEventListener('change', lhTest.checker);


    }

    static checker () {
        if (this.checked) {
            this.parentNode.style.textDecoration = 'line-through';
            this.parentNode.style.color = 'green';
        } else {
            this.parentNode.style = null;
        }
    }

    static createId (name, i) {
        return name.replace(/[^a-z]/gi, '') + '-' + i;
    }

    static toggleActive (button) {

        var active = button.dataset.active;

        all ($$('button', button.parentNode), function (otherButton) {
            otherButton.dataset.active = 'off';
        });

        if (active == 'off') {
            button.dataset.active = 'on';
        } else {
            button.dataset.active = 'off';
        }

    }

}
