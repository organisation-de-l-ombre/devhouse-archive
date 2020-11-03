/*
 * Button component
 */


import styles from './Button.module.scss';

// Uses the dom to improve performance; Since this website is made to be runned on low-end devices.
const event = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button: HTMLButtonElement = event.currentTarget as any;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add(styles.ripple); 

    const ripple = button.getElementsByClassName(styles.ripple)[0];

    if (ripple) {
        ripple.remove();
    }
    button.appendChild(circle);
};

export const Button: React.FC = (props) => {
    return (
        <button {...props} className={styles.button} onClick={event}/>
    );
}