r=[1     2     3     4     5     6     7];

x1=[0.4935    0.7704    0.8678    0.9005    0.9116    0.9156    0.9170];
x2=[0.3356    0.5408    0.6280    0.6647    0.6807    0.6879    0.6913];
x3=[0.2107    0.3280    0.3782    0.4006    0.4114    0.4168    0.4196];
x4=[0.1233    0.1763    0.1954    0.2029    0.2060    0.2074    0.2079];

y1=[0.4406    0.7984    0.9145    0.9439    0.9507    0.9523    0.9526];
y2=[0.2695    0.5175    0.6377    0.6867    0.7055    0.7125    0.7151];
y3=[0.1482    0.2706    0.3358    0.3677    0.3831    0.3906    0.3942];
y4=[0.0751    0.1203    0.1418    0.1523    0.1576    0.1605    0.1620];

x=[0];
y=[0];

figure1 = figure('Color', [1 1 1], 'PaperPosition',[0.6345 6.345 20.3 15.23],'PaperSize',[20.98 29.68]);

axes1 = axes('Parent',figure1);
xlabel(axes1,'number of restorative stages');
ylabel(axes1,'Probability');
box(axes1, 'on');
hold(axes1, 'all');

plot(x,y, 'w');
plot0 = plot(r, x1, 'bo-', 'Parent', axes1);
plot1 = plot(r, x2, 'gs-', 'Parent', axes1);
plot2 = plot(r, x3, 'r^-', 'Parent', axes1);
plot3 = plot(r, x4, 'cd-', 'Parent', axes1);
plot(x,y, 'w');
plot4 = plot(r, y1, 'bo--', 'Parent', axes1);
plot5 = plot(r, y2, 'gs--', 'Parent', axes1);
plot6 = plot(r, y3, 'r^--', 'Parent', axes1);
plot7 = plot(r, y4, 'cd--', 'Parent', axes1);


legend1  =  legend(axes1,{'',' \lambda = 0.01', ' \lambda = 0.02', ' \lambda = 0.03', ' \lambda = 0.04','',' \lambda = 0.01', ' \lambda = 0.02', ' \lambda = 0.03', ' \lambda = 0.04'},'Location', 'EastOutside');
