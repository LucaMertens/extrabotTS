sudo apt update
sudo apt upgrade -y
sudo apt install node -y
sudo apt install npm -y
sudo apt install ffmpeg -y
sudo apt install git -y
git clone https://github.com/lucamertens/extrabotts.git
cd extrabotts
npm install --only=prod
