export function generalMail(username: string, message: any) {
  return `
            <h3>Hi ${username},</h3>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            <a href="${message}">Click here</a>
            </p>
            <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis nesciunt
            reiciendis cumque incidunt possimus nulla laudantium ab ullam reprehenderit
            debitis, illo consequatur unde dolor, omnis qui necessitatibus. Natus, ipsa
            tempora?
            </p>
  `;
}

export function contactMail(
  username: string,
  email: any,
  phoneNumber: any,
  message: any
) {
  return `
            <p>Username: ${username},</p>
            <p>Email address: ${email},</p>
            <p>phone number: ${phoneNumber},</p>
            <p>${message}</p>
  `;
}
